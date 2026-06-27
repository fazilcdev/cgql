import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { Subscription } from 'chatbuk-common/dist/services/subscription/services';
import { GqlAuthGuard } from '../../../common/authentication/guards/gql-auth.guard';
import { ACRolesGuard } from '../../../common/access-controll/guards/ac-roles.guard';
import { ACRoles } from '../../../common/access-controll/decorators/ac-roles.decorator';
import { Roles } from '../../../common/access-controll/init';
import { TokenUser } from '../../../common/authentication/decorators/tokenUser.decorator';
import { toGraphQLError } from '../../../common/errors/to-graphql-error';

/**
 * User-subscription + ledger API. Admin operations are role-gated (Admin / Super Admin); the
 * `mySubscription` query is for the authenticated user's own active subscription. All authorization
 * + lifecycle logic lives in the subscription service — this resolver only forwards over NATS.
 */
@Resolver()
export class UserSubscriptionResolver {
  constructor(private readonly nats: NatsClientService) {}

  private call(cmd: string, payload: any) {
    return this.nats
      .sendSync(RPCServices.Subscription, cmd, payload)
      .catch((e) => {
        throw toGraphQLError(e);
      });
  }

  // ---- Admin: list users' subscriptions ----------------------------------
  @UseGuards(GqlAuthGuard, ACRolesGuard)
  @ACRoles(['Admin', 'Super Admin'])
  @Query(() => GraphQLJSON, { nullable: true })
  async getManyUserSubscriptions(
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @Args({ name: 'sort', nullable: true, type: () => String }) sort: string,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject }) condition: any,
  ) {
    return this.call(Subscription.GetManyUserSubscriptionsQuery, {
      limit,
      skip,
      sort: sort || { createdAt: -1 },
      condition,
      // Populate the user + plan so the admin table shows who + which plan.
      fieldsMap: { authUser: { firstName: false, lastName: false, email: false, mobile: false }, plan: { name: false, type: false, pricing: false } },
    });
  }

  @UseGuards(GqlAuthGuard, ACRolesGuard)
  @ACRoles(['Admin', 'Super Admin'])
  @Query(() => GraphQLJSON, { nullable: true })
  async getUserSubscriptionsCount(
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject }) condition: any,
  ) {
    return this.call(Subscription.GetUserSubscriptionsCountQuery, { condition });
  }

  // ---- Admin: subscription ledger ----------------------------------------
  @UseGuards(GqlAuthGuard, ACRolesGuard)
  @ACRoles(['Admin', 'Super Admin'])
  @Query(() => GraphQLJSON, { nullable: true })
  async subscriptionLogs(
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject }) condition: any,
  ) {
    return this.call(Subscription.GetManySubscriptionLogsQuery, {
      limit,
      skip,
      condition,
      fieldsMap: { authUser: { firstName: false, email: false }, plan: { name: false }, performedBy: { firstName: false, email: false } },
    });
  }

  // ---- User: my active subscription --------------------------------------
  @UseGuards(GqlAuthGuard)
  @Query(() => GraphQLJSONObject, { nullable: true })
  async mySubscription(@TokenUser() user: any) {
    const userId = user?.id || user?._id;
    // Only an active, in-window row counts as the current plan: a row whose endDate has passed
    // (but isn't yet swept to 'expired') must not show as the current plan. `___`/`__` are decoded
    // to `$`/`.` by GqlBuildCondition, so this becomes a Mongo $or window check.
    return this.call(Subscription.GetOneUserSubscriptionQuery, {
      condition: {
        authUser: String(userId),
        status: 'active',
        ___or: [{ endDate: null }, { endDate: { ___gte: new Date().toISOString() } }],
      },
      fieldsMap: { plan: {} },
      skip: 0,
    });
  }

  // ---- Admin: assign / cancel / update -----------------------------------
  @UseGuards(GqlAuthGuard, ACRolesGuard)
  @ACRoles(['Admin', 'Super Admin'])
  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async assignUserSubscription(
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
    @TokenUser() user: any,
  ) {
    return this.call(Subscription.AssignUserSubscriptionCommand, { data, tokenUser: user });
  }

  // ---- User self-cancel + Admin cancel -----------------------------------
  // Authenticated only (no role gate): a normal user may cancel *their own* active subscription;
  // an Admin / Super Admin may target any subscription (by id / authUser / org). For non-admins we
  // strip all targeting and force the filter to their own token id, so a regular user can never
  // cancel someone else's plan. `note` is the optional cancellation reason (stored on the row + ledger).
  @UseGuards(GqlAuthGuard)
  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async cancelUserSubscription(
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
    @TokenUser() user: any,
  ) {
    const roles: string[] = user?.roles || [];
    const isAdmin = roles.includes(Roles.Admin) || roles.includes(Roles.SuperAdmin);
    const safeData = isAdmin
      ? data
      : {
          authUser: String(user?.id || user?._id),
          immediate: data?.immediate ?? false,
          note: data?.note,
        };
    return this.call(Subscription.CancelUserSubscriptionCommand, { data: safeData, tokenUser: user });
  }

  @UseGuards(GqlAuthGuard, ACRolesGuard)
  @ACRoles(['Admin', 'Super Admin'])
  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async updateUserSubscription(
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
    @TokenUser() user: any,
  ) {
    return this.call(Subscription.UpdateUserSubscriptionCommand, { data, tokenUser: user });
  }
}
