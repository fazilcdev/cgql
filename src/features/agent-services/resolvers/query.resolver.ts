import { UseGuards } from '@nestjs/common';
import { Resolver, Args, Query } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { GqlFieldsMap } from 'chatbuk-common/dist/common/decorators/gql-fields-map.decorator';
import { GqlProjection } from 'chatbuk-common/dist/common/decorators/gql-projection.decorator';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { McpApp, Records } from 'chatbuk-common/dist/services/agent-service/entities';
import { TokenUser } from '../../../common/authentication/decorators/tokenUser.decorator';
import { GqlAuthGuard } from '../../../common/authentication/guards/gql-auth.guard';
import { toGraphQLError } from '../../../common/errors/to-graphql-error';
import { McpApp as McpAppType } from '../types/mcpApp.type';
import { ChatMessageType } from '../types/chat-message.type';
import { GetManyChatMessagesQueryDto } from '../dtos/get-many-chat-messages.dto';
import { TransactionType } from '../types/transaction.type';
import { GetManyTransactionsQueryDto } from '../dtos/get-many-transactions.dto';

@Resolver()
export class QueryResolver {
  constructor(private readonly nats: NatsClientService) { }

  private normalizeJsonObject(value: any) {
    if (!value || typeof value === 'object') return value;
    if (typeof value !== 'string') return { value };

    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' ? parsed : { value: parsed };
    } catch {
      return { value };
    }
  }

  // Dynamic Advanced-Config schema for an (appCode, domain). App-agnostic JSON descriptor the
  // frontend renders into a form; proxied to agent-service over NATS (was a direct REST call).
  @Query(() => GraphQLJSONObject, { nullable: true })
  async getAppConfigSchema(
    @Args({ name: 'appCode', nullable: true, type: () => String }) appCode?: string,
    @Args({ name: 'domain', nullable: true, type: () => String }) domain?: string,
  ) {
    return await this.nats
      .sendSync(RPCServices.AgentService, Records.GetConfigSchemaQuery, {
        appCode,
        domain,
      })
      .catch(e => {
        throw toGraphQLError(e);
      });
  }

  // -------------------------  McpApp ------------------------------------------ //

  @Query(returns => String, { nullable: true })
  async GetMcpAppsCount(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {

    return await this.nats
      .sendSync(RPCServices.AgentService, McpApp.GetMcpAppCountQuery, {
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw toGraphQLError(e);
      });
  }

  @Query(returns => McpAppType, { nullable: true })
  async getOneMcpApp(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.AgentService, McpApp.GetOneMcpAppQuery, {
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw toGraphQLError(e);
      });
  }

  @Query(returns => [McpAppType])
  async getManyMcpApps(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @Args({ name: 'sort', nullable: true, type: () => String }) sort: string,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.AgentService, McpApp.GetManyMcpAppQuery, {
        limit: limit,
        skip: skip,
        sort: sort,
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        console.log(e.message)
        throw toGraphQLError(e);
      });
  }

  @Query(returns => [ChatMessageType])
  @UseGuards(GqlAuthGuard)
  async getManyChatMessages(
    @Args('params') params: GetManyChatMessagesQueryDto,
    @TokenUser() user: any,
  ) {
    const messages = await this.nats
      .sendSync(RPCServices.AgentService, McpApp.GetManyChatMessageQuery, {
        params: params,
        tokenUser: user,
      })
      .catch(e => {
        console.log(e.message)
        throw toGraphQLError(e);
      });

    return messages.map((msg: any) => {
      if (msg.createdAt) {
        msg.createdAt = new Date(msg.createdAt);
      }
      const authUser = msg.authUser;
      if (authUser && typeof authUser === 'object') {
        msg.sender = {
          id: String(authUser._id || authUser.id || ''),
          name: [authUser.firstName, authUser.lastName].filter(Boolean).join(' ') || authUser.email,
          email: authUser.email,
          avatar: authUser.picture,
        };
        msg.authUser = String(authUser._id || authUser.id || '');
      }
      msg.inputs = this.normalizeJsonObject(msg.inputs);
      msg.result = this.normalizeJsonObject(msg.result);
      msg.rich = this.normalizeJsonObject(msg.rich);
      msg.tempResult = this.normalizeJsonObject(msg.tempResult);
      return msg;
    });
  }

  @Query(returns => [TransactionType])
  async getManyTransactions(
    @Args('params', { nullable: true }) params: GetManyTransactionsQueryDto,
    @TokenUser() user: any,
  ) {
    const transactions = await this.nats
      .sendSync(RPCServices.AgentService, McpApp.GetManyTransactionQuery, {
        params: params,
        tokenUser: user
      })
      .catch(e => {
        throw toGraphQLError(e);
      });

    return transactions.map((t: any) => ({
      ...t,
      id: t._id,
      createdAt: t.createdAt ? new Date(t.createdAt) : null
    }));
  }

  @Query(returns => TransactionType, { nullable: true })
  async getOneTransaction(
    @Args('id') id: string,
    @TokenUser() user: any,
  ) {
    const transaction = await this.nats
      .sendSync(RPCServices.AgentService, McpApp.GetOneTransactionQuery, {
        id: id,
        tokenUser: user
      })
      .catch(e => {
        throw toGraphQLError(e);
      });

    if (transaction) {
      transaction.id = transaction._id;
      if (transaction.createdAt) transaction.createdAt = new Date(transaction.createdAt);
    }
    return transaction;
  }
}
