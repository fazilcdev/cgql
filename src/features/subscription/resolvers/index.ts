import { CommandResolver } from './command.resolver';
import { QueryResolver } from './query.resolver';
import { UserSubscriptionResolver } from './user-subscription.resolver';
import { PaymentResolver } from './payment.resolver';

export const Resolvers = [CommandResolver, QueryResolver, UserSubscriptionResolver, PaymentResolver];