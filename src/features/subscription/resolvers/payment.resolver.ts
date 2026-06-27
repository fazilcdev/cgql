import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';
import { toGraphQLError } from '../../../common/errors/to-graphql-error';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { Subscription } from 'chatbuk-common/dist/services/subscription/services';
import { GqlAuthGuard } from '../../../common/authentication/guards/gql-auth.guard';
import { ACRolesGuard } from '../../../common/access-controll/guards/ac-roles.guard';
import { ACRoles } from '../../../common/access-controll/decorators/ac-roles.decorator';
import { TokenUser } from '../../../common/authentication/decorators/tokenUser.decorator';

/**
 * Self-serve Cashfree checkout for the authenticated user. All payment/gateway logic lives in the
 * subscription service; this resolver only forwards over NATS using the logged-in user as the buyer.
 */
@Resolver()
export class PaymentResolver {
  constructor(private readonly nats: NatsClientService) {}

  private call(cmd: string, payload: any) {
    return this.nats.sendSync(RPCServices.Subscription, cmd, payload).catch((e) => {
      throw toGraphQLError(e);
    });
  }

  /** Create a Cashfree order; returns { orderId, paymentSessionId, amount, currency, mode }. */
  @UseGuards(GqlAuthGuard)
  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async createCheckout(
    @Args({ name: 'planId', type: () => String }) planId: string,
    @Args({ name: 'billingCycle', type: () => String }) billingCycle: string,
    @Args({ name: 'currency', nullable: true, type: () => String }) currency: string,
    @Args({ name: 'customer', nullable: true, type: () => GraphQLJSONObject }) customer: any,
    @TokenUser() user: any,
  ) {
    return this.call(Subscription.CreateCheckoutCommand, {
      data: { planId, billingCycle, currency, customer },
      tokenUser: user,
    });
  }

  /** Reconcile an order to terminal state (used by the return-page poll). Idempotent. */
  @UseGuards(GqlAuthGuard)
  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async confirmPayment(
    @Args({ name: 'orderId', type: () => String }) orderId: string,
    @TokenUser() user: any,
  ) {
    return this.call(Subscription.ConfirmPaymentCommand, { orderId, tokenUser: user });
  }

  /** The authenticated user's own gateway payment history. */
  @UseGuards(GqlAuthGuard)
  @Query(() => GraphQLJSON, { nullable: true })
  async myPaymentTransactions(
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @TokenUser() user: any,
  ) {
    const userId = user?.id || user?._id;
    return this.call(Subscription.GetManyPaymentTransactionsQuery, {
      condition: { authUser: String(userId) },
      limit: limit || 20,
      skip: skip || 0,
      sort: { createdAt: -1 },
      fieldsMap: { plan: { name: false, type: false } },
    });
  }

  /** Admin: all gateway transactions (the admin payments / reconciliation view). */
  @UseGuards(GqlAuthGuard, ACRolesGuard)
  @ACRoles(['Admin', 'Super Admin'])
  @Query(() => GraphQLJSON, { nullable: true })
  async paymentTransactions(
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject }) condition: any,
  ) {
    return this.call(Subscription.GetManyPaymentTransactionsQuery, {
      condition,
      limit: limit || 50,
      skip: skip || 0,
      sort: { createdAt: -1 },
      fieldsMap: { authUser: { firstName: false, email: false }, plan: { name: false } },
    });
  }
}
