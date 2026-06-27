import { Controller, Get, Query, Req, Res, UseGuards, Logger } from '@nestjs/common';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { Records } from 'chatbuk-common/dist/services/agent-service/entities';
import { GqlAuthGuard } from '../../../common/authentication/guards/gql-auth.guard';

/**
 * Excel export for the agent report. Binary generation lives in the gateway (not agent-service):
 * agent-service stays JSON-only, while this controller reuses the same JWT auth + NATS forwarding
 * as the records resolver. Workspace scoping / summary.all are enforced server-side in
 * agent-service, so the file respects the caller's permissions automatically.
 *
 * Reached from the UI the same way as MediaController — i.e. serverUrl('/records/report.xlsx')
 * — so it follows whatever base/proxy routing already serves /media.
 */
@Controller('records')
export class RecordsExportController {
  private readonly logger = new Logger(RecordsExportController.name);

  constructor(private readonly nats: NatsClientService) {}

  @Get('report.xlsx')
  @UseGuards(GqlAuthGuard)
  async exportReport(
    @Req() req: any,
    @Res() res: Response,
    @Query('agentId') agentId?: string,
    @Query('workspaceId') workspaceId?: string,
    @Query('domain') domain?: string,
    @Query('period') period?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('recordType') recordType?: string,
    @Query('childAgentId') childAgentId?: string,
  ) {
    const user = req.user;
    const filter: any = {
      agentId,
      workspaceId,
      domain: domain || 'finance',
      period,
      dateFrom,
      dateTo,
      recordType,
      // Report roll-up: export the same scope the page shows (child or summary).
      childAgentId,
      limit: 5000, // pull the full set for export (not just the page's 10)
    };

    const payload: any = await this.nats
      .sendSync(RPCServices.AgentService, Records.GetReportQuery, {
        data: filter,
        tokenUser: user,
      })
      .catch((e) => {
        this.logger.error(`report export failed: ${e?.message || e}`);
        throw e;
      });

    const report = payload?.report || {};
    const records: any[] = payload?.records || [];
    const totals = report?.totals || {};
    const categories: any[] = report?.categories || [];
    const periodLabel = payload?.period || period || 'all';
    const primaryCurrency = totals?.primaryCurrency || totals?.currency || 'INR';
    // Per-currency rows from the report; fall back to a single primary-currency row for old payloads.
    const byCurrency: any[] =
      Array.isArray(totals?.byCurrency) && totals.byCurrency.length
        ? totals.byCurrency
        : [
            {
              currency: primaryCurrency,
              count: totals.count ?? records.length,
              expenseAmount: totals.expenseAmount,
              incomeAmount: totals.incomeAmount,
              operatingExpenseAmount: totals.operatingExpenseAmount,
              operatingIncomeAmount: totals.operatingIncomeAmount,
              investmentAmount: totals.investmentAmount,
              netAmount: totals.netAmount,
              amount: totals.amount,
            },
          ];
    // Operating spending/income (investments pulled out) — fall back to gross for older payloads.
    const operatingExpense = (b: any) =>
      b.operatingExpenseAmount ?? b.expenseAmount;
    const operatingIncome = (b: any) =>
      b.operatingIncomeAmount ?? b.incomeAmount;
    // Only show the Investments column when some currency actually has investment activity.
    const hasInvestments = byCurrency.some(
      (b: any) => Math.round(Number(b.investmentAmount || 0)) !== 0,
    );
    const isOutlier = (cur?: string) =>
      String(cur || '').toUpperCase() !== String(primaryCurrency).toUpperCase();
    // Amber fill used to flag any non-primary ("outlier") currency cell/row.
    const OUTLIER_FILL: ExcelJS.Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFF3CD' },
    };

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'chatbuk';

    // ---- Summary sheet (one row per currency — currencies are never summed together) ----
    const summary = workbook.addWorksheet('Summary');
    summary.columns = [
      { header: 'Currency', key: 'currency', width: 12 },
      { header: 'Entries', key: 'count', width: 10 },
      { header: 'Income', key: 'income', width: 16 },
      { header: 'Spending', key: 'expense', width: 16 },
      ...(hasInvestments
        ? [{ header: 'Investments', key: 'investment', width: 16 }]
        : []),
      { header: 'Net', key: 'net', width: 16 },
    ];
    summary.getRow(1).font = { bold: true };
    summary.addRow({ currency: `Period: ${periodLabel}` }).font = {
      italic: true,
    };
    for (const b of byCurrency) {
      const row = summary.addRow({
        currency: b.currency + (isOutlier(b.currency) ? '  (outlier)' : ''),
        count: b.count ?? '',
        income: numOrBlank(operatingIncome(b)),
        expense: numOrBlank(operatingExpense(b)),
        ...(hasInvestments
          ? { investment: numOrBlank(b.investmentAmount) }
          : {}),
        net: numOrBlank(b.netAmount ?? b.amount),
      });
      if (isOutlier(b.currency)) row.eachCell((cell) => (cell.fill = OUTLIER_FILL));
    }
    // Optional approximate combined total (FX-converted) — clearly labeled, never a real sum.
    if (totals?.converted) {
      const c = totals.converted;
      const row = summary.addRow({
        currency: `≈ ${c.currency} (converted)`,
        count: '',
        income: numOrBlank(operatingIncome(c)),
        expense: numOrBlank(operatingExpense(c)),
        ...(hasInvestments ? { investment: numOrBlank(c.investmentAmount) } : {}),
        net: numOrBlank(c.netAmount),
      });
      row.font = { italic: true };
    }

    // ---- Transactions sheet ----
    const txns = workbook.addWorksheet('Transactions');
    txns.columns = [
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Direction', key: 'direction', width: 12 },
      { header: 'Amount', key: 'amount', width: 14 },
      { header: 'Currency', key: 'currency', width: 10 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Merchant', key: 'merchant', width: 22 },
      { header: 'Description', key: 'description', width: 40 },
    ];
    txns.getRow(1).font = { bold: true };
    for (const rec of records) {
      const f = rec?.fields || {};
      const cur = f.currency || primaryCurrency;
      const row = txns.addRow({
        date: f.date || (rec?.createdAt ? String(rec.createdAt).slice(0, 10) : ''),
        direction: f.direction || '',
        amount: Number(f.amount ?? 0),
        currency: cur,
        category: f.category || '',
        merchant: f.merchant || '',
        description: f.description || f.item || '',
      });
      // Highlight rows whose currency differs from the primary so outliers stand out.
      if (isOutlier(cur)) row.eachCell((cell) => (cell.fill = OUTLIER_FILL));
    }

    // ---- By Category sheet (grouped per category+currency; never summed across currencies) ----
    const byCat = workbook.addWorksheet('By Category');
    byCat.columns = [
      { header: 'Category', key: 'label', width: 24 },
      { header: 'Currency', key: 'currency', width: 10 },
      { header: 'Direction', key: 'direction', width: 12 },
      { header: 'Amount', key: 'value', width: 16 },
      { header: '%', key: 'percentage', width: 8 },
      { header: 'Count', key: 'count', width: 8 },
    ];
    byCat.getRow(1).font = { bold: true };
    for (const c of categories) {
      const cur = c.currency || primaryCurrency;
      const row = byCat.addRow({
        label: c.label,
        currency: cur,
        direction: c.direction || '',
        value: Number(c.value ?? 0),
        percentage: c.percentage ?? '',
        count: c.count ?? '',
      });
      if (isOutlier(cur)) row.eachCell((cell) => (cell.fill = OUTLIER_FILL));
    }

    const safePeriod = periodLabel.replace(/[^\w-]+/g, '_');
    const filename = `${filter.domain}-report-${safePeriod}.xlsx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    await workbook.xlsx.write(res);
    res.end();
  }
}

/** Render a numeric cell, leaving it blank when the value is absent (not 0). */
function numOrBlank(value: any): number | string {
  return value === undefined || value === null ? '' : Number(value);
}
