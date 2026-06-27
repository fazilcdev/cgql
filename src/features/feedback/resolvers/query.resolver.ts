import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJSONObject } from 'graphql-type-json';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { Users } from 'chatbuk-common/dist/services/users/services';
import { toGraphQLError } from '../../../common/errors/to-graphql-error';

import { FeedbackType } from '../types/feedback.type';

import { ACRoles } from '../../../common/access-controll/decorators/ac-roles.decorator';
import { ACRolesGuard } from '../../../common/access-controll/guards/ac-roles.guard';
import { GqlAuthGuard } from '../../../common/authentication/guards/gql-auth.guard';

// Reading and triaging feedback is admin-only. Submitting (sendFeedback) stays public.
@UseGuards(GqlAuthGuard, ACRolesGuard)
@ACRoles(['Admin', 'Super Admin'])
@Resolver()
export class QueryResolver {
  constructor(private readonly nats: NatsClientService) {}

  @Query(() => [FeedbackType])
  async getManyFeedbacks(
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @Args({ name: 'sort', nullable: true, type: () => GraphQLJSONObject }) sort: any,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Users, Users.GetManyFeedbacksQuery, {
        limit,
        skip,
        sort,
        condition,
      })
      .catch((e) => {
        throw toGraphQLError(e);
      });
  }

  @Query(() => Int)
  async getFeedbacksCount(
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Users, Users.GetFeedbacksCountQuery, { condition })
      .catch((e) => {
        throw toGraphQLError(e);
      });
  }

  @Mutation(() => FeedbackType)
  async updateFeedbackStatus(
    @Args('id') id: string,
    @Args('status') status: string,
  ) {
    return await this.nats
      .sendSync(RPCServices.Users, Users.UpdateFeedbackStatusCommand, { id, status })
      .catch((e) => {
        throw toGraphQLError(e);
      });
  }
}
