import { Resolver, Args, Query } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { NatsClientService } from 'selfpod-common/dist/common/rpc-clients/nats/nats-client.module';
import { GqlFieldsMap } from 'selfpod-common/dist/common/decorators/gql-fields-map.decorator';
import { GqlProjection } from 'selfpod-common/dist/common/decorators/gql-projection.decorator';
import { RPCServices } from 'selfpod-common/dist/services/rpc-services';
import { DestinationApp } from 'selfpod-common/dist/services/destination-app-integrations/services';
import { TokenUser } from '../../../common/authentication/decorators/tokenUser.decorator';
import { GraphQLError } from 'graphql';
import { DestinationAppType } from '../types/destinationApp.type';

@Resolver()
export class QueryResolver {
  constructor(private readonly nats: NatsClientService) { }

  // -------------------------  DestinationApp ------------------------------------------ //

  @Query(returns => String, { nullable: true })
  async GetDestinationAppsCount(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {

    return await this.nats
      .sendSync(RPCServices.DestinationApp, DestinationApp.GetDestinationAppCountQuery, {
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

  @Query(returns => DestinationAppType, { nullable: true })
  async getOneDestinationApp(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.DestinationApp, DestinationApp.GetOneDestinationAppQuery, {
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

  @Query(returns => [DestinationAppType])
  async getManyDestinationApps(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @Args({ name: 'sort', nullable: true, type: () => String }) sort: string,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.DestinationApp, DestinationApp.GetManyDestinationAppQuery, {
        limit: limit,
        skip: skip,
        sort: sort,
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }


}
