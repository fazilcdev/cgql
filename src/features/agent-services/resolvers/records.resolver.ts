import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJSONObject } from 'graphql-type-json';
import { GraphQLError } from 'graphql';
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
      .catch(e => { throw new GraphQLError(e.message); });
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

  @Query(() => GraphQLJSONObject, { nullable: true })
  async chatRecords(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.call(Records.GetChatRecordsQuery, data || {}, user);
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

  // Privacy — "delete permanently": purge all records/aggregates/vectors, then permanently
  // remove (PII-scrubbed) the auth account. Orchestrated across agent-service + auth.
  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async deleteMyAccount(@TokenUser() user: any) {
    const userId = user?.id || user?._id;
    if (!userId) throw new GraphQLError('unauthorized');

    // 1. Erase the user's personal data we hold — records, aggregates, memory vectors, connection
    //    tokens, logs, chat, legacy transactions. Shared-workspace / organisation data is retained.
    await this.call(Records.PurgeAccountDataCommand, {}, user);

    // 2. Permanently remove the auth user (handler scrubs PII before soft-delete).
    await this.nats
      .sendSync(RPCServices.Auth, Auth.DeleteAuthUserCommand, { id: String(userId) })
      .catch(e => { throw new GraphQLError(e.message); });

    return { ok: true };
  }
}
