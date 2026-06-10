import { Resolver, Args, Query } from "@nestjs/graphql";
import { Int } from "@nestjs/graphql";
import { GraphQLJSONObject } from 'graphql-type-json';
import { NatsClientService } from "chatbuk-common/dist/common/rpc-clients/nats/nats-client.module";
import { GqlFieldsMap } from "chatbuk-common/dist/common/decorators/gql-fields-map.decorator";
import { GqlProjection } from "chatbuk-common/dist/common/decorators/gql-projection.decorator";
import { RPCServices } from "chatbuk-common/dist/services/rpc-services";
import { Auditlog } from "chatbuk-common/dist/services/auditlog/services";
import { GraphQLError } from 'graphql';
import { UserLogType } from "../types/userLog.type";

@Resolver()
export class QueryResolver {

  constructor(
    private readonly nats: NatsClientService
  ) { }

  // Message_Patterns

  // -------------------------  UserLog ------------------------------------------ //

  @Query(returns => UserLogType, { nullable: true })
  async getOneUserLog(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject }) condition: any
  ) {
    return await this.nats.sendSync(RPCServices.Auditlog, Auditlog.GetOneUserLogQuery, {
      condition: condition,
      fieldsMap: fieldsMap
    }).catch((e) => { throw new GraphQLError(e) });
  }

  @Query(returns => [UserLogType])
  async getManyUserLogs(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @Args({ name: 'sort', nullable: true, type: () => String }) sort: string,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject }) condition: any
  ) {
    return await this.nats.sendSync(RPCServices.Auditlog, Auditlog.GetManyUserLogQuery, {
      limit: limit,
      skip: skip,
      sort: sort,
      condition: condition,
      fieldsMap: fieldsMap
    }).catch((e) => { throw new GraphQLError(e) });
  }

  @Query(returns => String, { nullable: true })
  async GetUserLogCount(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject }) condition: any
  ) {
    return await this.nats.sendSync(RPCServices.Auditlog, Auditlog.GetUserLogCountQuery, {
      condition: condition,
      fieldsMap: fieldsMap
    }).catch((e) => { throw new GraphQLError(e) });
  }

}
