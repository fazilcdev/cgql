import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';
import { GraphQLError } from 'graphql';
import { toGraphQLError } from '../../../common/errors/to-graphql-error';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { Records } from 'chatbuk-common/dist/services/agent-service/entities';
import { Auth } from 'chatbuk-common/dist/services/auth/services';
import { GqlAuthGuard } from '../../../common/authentication/guards/gql-auth.guard';
import { TokenUser } from '../../../common/authentication/decorators/tokenUser.decorator';

/**
 * Records API — lets the UI list/edit/delete records and read insights directly (no chat),
 * scoped to the authenticated user. All ownership/workspace authorization happens in
 * agent-service; this resolver only forwards the validated tokenUser.
 */
@UseGuards(GqlAuthGuard)
@Resolver()
export class RecordsResolver {
  constructor(private readonly nats: NatsClientService) { }

  private call(cmd: string, data: any, user: any) {
    return this.nats
      .sendSync(RPCServices.AgentService, cmd, { data, tokenUser: user })
      .catch(e => { throw toGraphQLError(e); });
  }

  @Query(() => GraphQLJSONObject, { nullable: true })
  async records(
    @TokenUser() user: any,
    @Args({ name: 'filter', nullable: true, type: () => GraphQLJSONObject }) filter: any,
  ) {
    return this.call(Records.ListRecordsQuery, filter || {}, user);
  }

  @Query(() => GraphQLJSONObject, { nullable: true })
  async recordInsights(
    @TokenUser() user: any,
    @Args({ name: 'filter', nullable: true, type: () => GraphQLJSONObject }) filter: any,
  ) {
    return this.call(Records.GetInsightsQuery, filter || {}, user);
  }

  // Per-agent-type report payload (totals, series, categories, records, insights) — drives the
  // report page. Domain-pack driven, so finance is rich and other domains get a generic report.
  @Query(() => GraphQLJSONObject, { nullable: true })
  async agentReport(
    @TokenUser() user: any,
    @Args({ name: 'filter', nullable: true, type: () => GraphQLJSONObject }) filter: any,
  ) {
    return this.call(Records.GetReportQuery, filter || {}, user);
  }

  // List a parent agent's child agents (first-class sub-chats) for the report child-filter dropdown.
  // Manager-gated in agent-service (Capability.SummaryAll); returns [] for non-managers/leaf agents.
  @Query(() => GraphQLJSON, { nullable: true })
  async agentReportChildren(
    @TokenUser() user: any,
    @Args({ name: 'filter', nullable: true, type: () => GraphQLJSONObject }) filter: any,
  ) {
    return this.call(Records.ListReportChildrenQuery, filter || {}, user);
  }

  @Query(() => GraphQLJSONObject, { nullable: true })
  async chatRecords(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.call(Records.GetChatRecordsQuery, data || {}, user);
  }

  // Read-only catalog vocabulary (categories/subcategories/tags) for a workspace+domain — powers the
  // in-chat record editor's dropdowns. Returns [{ value, count, source }].
  @Query(() => GraphQLJSON, { nullable: true })
  async catalogValues(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.call(Records.ListCatalogValuesQuery, data || {}, user);
  }

  // Read the effective per-workspace edit-restriction policy (defaults + overrides).
  @Query(() => GraphQLJSONObject, { nullable: true })
  async editPolicy(
    @TokenUser() user: any,
    @Args({ name: 'workspaceId', nullable: true }) workspaceId?: string,
  ) {
    return this.call(Records.GetEditPolicyQuery, { workspaceId }, user);
  }

  // Owner/admin-only — set the per-workspace edit-restriction policy.
  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async updateEditPolicy(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.call(Records.UpdateEditPolicyCommand, data, user);
  }

  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async editRecord(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.call(Records.EditRecordCommand, data, user);
  }

  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async deleteRecord(@TokenUser() user: any, @Args('recordId') recordId: string) {
    return this.call(Records.DeleteRecordCommand, { recordId }, user);
  }

  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async purgeMyData(
    @TokenUser() user: any,
    @Args({ name: 'workspaceId', nullable: true }) workspaceId?: string,
  ) {
    return this.call(Records.PurgeUserDataCommand, { workspaceId }, user);
  }

  // Privacy — "export everything": returns the user's records + aggregates + memory content.
  @Query(() => GraphQLJSONObject, { nullable: true })
  async exportMyData(
    @TokenUser() user: any,
    @Args({ name: 'workspaceId', nullable: true }) workspaceId?: string,
  ) {
    return this.call(Records.ExportUserDataCommand, { workspaceId }, user);
  }

  // Disconnect a connected third-party app — revokes + deletes the token we store.
  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async disconnectApp(@TokenUser() user: any, @Args('providerId') providerId: string) {
    return this.call(Records.DisconnectAppCommand, { providerId }, user);
  }

  // The provider codes (e.g. 'google') the user has connected — drives connected-app status in the UI.
  @Query(() => [String])
  async connectedProviders(@TokenUser() user: any) {
    return this.call(Records.ConnectedProvidersQuery, {}, user);
  }

  // Mint the provider's OAuth consent URL (returns { url }). Routed through the gateway so the
  // browser never has to reach agent-service directly — only the gateway is exposed by nginx. The
  // userId is taken from the validated token; agentId/mcpAppId (when the connect starts from a chat)
  // ride in the encrypted state so the callback can attach the app to that agent.
  @Query(() => GraphQLJSONObject)
  async mcpAuthUrl(
    @TokenUser() user: any,
    @Args('providerId') providerId: string,
    @Args({ name: 'chatId', nullable: true }) chatId?: string,
    @Args({ name: 'returnUrl', nullable: true }) returnUrl?: string,
    @Args({ name: 'agentId', nullable: true }) agentId?: string,
    @Args({ name: 'mcpAppId', nullable: true }) mcpAppId?: string,
  ) {
    return this.call(
      Records.GetAuthUrlQuery,
      { providerId, chatId, returnUrl, agentId, mcpAppId },
      user,
    );
  }

  // Finish the OAuth flow — exchange the authorization code for tokens. Returns
  // { returnUrl, agentId, mcpAppId } so the Next.js callback can attach + send the user back.
  @Mutation(() => GraphQLJSONObject)
  async exchangeMcpOAuth(
    @TokenUser() user: any,
    @Args('providerId') providerId: string,
    @Args('code') code: string,
    @Args('state') state: string,
  ) {
    return this.call(
      Records.ExchangeOAuthCommand,
      { providerId, code, state },
      user,
    );
  }

  // Privacy — "delete permanently": purge all records/aggregates/vectors, then permanently
  // remove (PII-scrubbed) the auth account. Orchestrated across agent-service + auth.
  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async deleteMyAccount(@TokenUser() user: any) {
    const userId = user?.id || user?._id;
    if (!userId) throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHENTICATED', statusCode: 401 } });

    // 1. Erase the user's personal data we hold — records, aggregates, memory vectors, connection
    //    tokens, logs, chat, legacy transactions. Shared-workspace / organisation data is retained.
    await this.call(Records.PurgeAccountDataCommand, {}, user);

    // 2. Permanently remove the auth user (handler scrubs PII before soft-delete).
    await this.nats
      .sendSync(RPCServices.Auth, Auth.DeleteAuthUserCommand, { id: String(userId) })
      .catch(e => { throw toGraphQLError(e); });

    return { ok: true };
  }
}
