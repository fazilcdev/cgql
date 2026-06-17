import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import {
  SubscriptionPlanFeatureInput,
  SubscriptionPlanPricingInput,
} from './create-subscription-plan.dto';

@InputType()
export class UpdateSubscriptionPlanDto {
  @Field()
  id: string;

  @Field()
  fId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  flag?: string;

  @Field(() => [SubscriptionPlanPricingInput])
  pricing: SubscriptionPlanPricingInput[];

  @Field(() => [SubscriptionPlanFeatureInput], { nullable: true })
  features?: SubscriptionPlanFeatureInput[];

  /** Admin-picked feature VALUES enforced by the entitlement engine: { limits, flags }. */
  @Field(() => GraphQLJSONObject, { nullable: true })
  entitlements?: Record<string, any>;
}
