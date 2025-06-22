import { Resolver, Args, Query } from "@nestjs/graphql";
import { Int } from "@nestjs/graphql";
import { GraphQLJSONObject } from 'graphql-type-json';
import { NatsClientService } from "chatbuk-common/dist/common/rpc-clients/nats/nats-client.module";
import { GqlFieldsMap } from "chatbuk-common/dist/common/decorators/gql-fields-map.decorator";
import { GqlProjection } from "chatbuk-common/dist/common/decorators/gql-projection.decorator";
import { RPCServices } from "chatbuk-common/dist/services/rpc-services";
import { Auditlog } from "chatbuk-common/dist/services/auditlog/services";
import { GraphQLError } from 'graphql';
import { IbapUserLogType } from "../types/ibapUserLog.type";

@Resolver()
export class QueryResolver {

  constructor(
    private readonly nats: NatsClientService
  ) { }

  // Message_Patterns

// -------------------------  IbapUserLog ------------------------------------------ //

  @Query(returns => IbapUserLogType, { nullable: true })
  async getOneIbapUserLog(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject }) condition: any
  ) {
    return await this.nats.sendSync(RPCServices.Auditlog, Auditlog.GetOneIbapUserLogQuery, {
      condition: condition,
      fieldsMap: fieldsMap
    }).catch((e) => { throw new GraphQLError(e) });
  }

  @Query(returns => [IbapUserLogType])
  async getManyIbapUserLogs(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @Args({ name: 'sort', nullable: true, type: () => String }) sort: string,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject }) condition: any
  ) {
    return await this.nats.sendSync(RPCServices.Auditlog, Auditlog.GetManyIbapUserLogQuery, {
      limit: limit,
      skip: skip,
      sort: sort,
      condition: condition,
      fieldsMap: fieldsMap
    }).catch((e) => { throw new GraphQLError(e) });
  }

  @Query(returns => String, { nullable: true })
  async GetIbapUserLogCount(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject }) condition: any
  ) {
    return await this.nats.sendSync(RPCServices.Auditlog, Auditlog.GetIbapUserLogCountQuery, {
      condition: condition,
      fieldsMap: fieldsMap
    }).catch((e) => { throw new GraphQLError(e) });
  }
  
}
