import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { Subscription } from 'chatbuk-common/dist/services/subscription/services';
import { Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { DeleteDto } from '../../../common/dtos/delete.dto';
import { GraphQLError } from 'graphql';

import { CreateSubscriptionPlanDto } from '../dtos/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from '../dtos/update-subscription-plan.dto';

import { SubscriptionPlanType } from '../types/subscriptionPlan.type';

import { ACRoles } from '../../../common/access-controll/decorators/ac-roles.decorator';
import { ACRolesGuard } from '../../../common/access-controll/guards/ac-roles.guard';
import { GqlAuthGuard } from '../../../common/authentication/guards/gql-auth.guard';
import { TokenUser } from '../../../common/authentication/decorators/tokenUser.decorator';

// Plan CRUD is admin-only (Admin / Super Admin). Public reads use the unauthenticated query resolver.
@UseGuards(GqlAuthGuard, ACRolesGuard)
@ACRoles(['Admin', 'Super Admin'])
@Resolver()
export class CommandResolver {
  constructor(private readonly nats: NatsClientService) { }

  // Message_Patterns

  // -------------------------  Subscription plan ------------------------------------------ //

  @Mutation(returns => SubscriptionPlanType)
  async createSubscriptionPlan(
    @Args('data') data: CreateSubscriptionPlanDto,
    @TokenUser() user: any,
  ) {
    return await this.nats
      .sendSync(
        RPCServices.Subscription,
        Subscription.CreateSubscriptionPlanCommand,
        { data: data, tokenUser: user },
      )
      .catch(e => {
        console.log('e', e)
        throw new GraphQLError(e.message);
      });
  }

  //@ACRoles(['Admin', 'SuperAdmin'])
  @Mutation(returns => SubscriptionPlanType)
  async updateSubscriptionPlan(
    @Args('data') data: UpdateSubscriptionPlanDto,
    @TokenUser() user: any,

  ) {
    return await this.nats
      .sendSync(
        RPCServices.Subscription,
        Subscription.UpdateSubscriptionPlanCommand,
        { data: data, tokenUser: user },
      )
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

  //@ACRoles(['Admin', 'SuperAdmin'])
  @Mutation(returns => SubscriptionPlanType)
  async deleteSubscriptionPlan(
    @Args('data') data: DeleteDto,
    @TokenUser() user: any,
  ) {
    return await this.nats
      .sendSync(
        RPCServices.Subscription,
        Subscription.DeleteSubscriptionPlanCommand,
        { data: data, tokenUser: user },
      )
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }


}
