import { Resolver, Args, Query } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { NatsClientService } from 'selfpod-common/dist/common/rpc-clients/nats/nats-client.module';
import { GqlFieldsMap } from 'selfpod-common/dist/common/decorators/gql-fields-map.decorator';
import { GqlProjection } from 'selfpod-common/dist/common/decorators/gql-projection.decorator';
import { RPCServices } from 'selfpod-common/dist/services/rpc-services';
import { Subscription } from 'selfpod-common/dist/services/subscription/services';
import { TokenUser } from '../../../common/authentication/decorators/tokenUser.decorator';
import { GraphQLError } from 'graphql';

import { SubscriptionPlanType } from '../types/subscriptionPlan.type';

@Resolver()
export class QueryResolver {
  constructor(private readonly nats: NatsClientService) { }

  // -------------------------  Subscription Plan ------------------------------------------ //

  @Query(returns => String, { nullable: true })
  async GetSubscriptionPlansCount(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {

    return await this.nats
      .sendSync(RPCServices.Subscription, Subscription.GetSubscriptionPlansCountQuery, {
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

  @Query(returns => SubscriptionPlanType, { nullable: true })
  async getOneSubscriptionPlan(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Subscription, Subscription.GetOneSubscriptionPlanQuery, {
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

  @Query(returns => [SubscriptionPlanType])
  async getManySubscriptionPlans(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @Args({ name: 'sort', nullable: true, type: () => String }) sort: string,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Subscription, Subscription.GetManySubscriptionPlansQuery, {
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
