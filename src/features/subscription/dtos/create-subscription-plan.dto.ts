import { Field, Float, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class SubscriptionPlanPricingInput {
  @Field(() => [String], { nullable: true })
  countryCodes?: string[];

  @Field()
  currency: string;

  @Field(() => Float)
  monthly: number;

  @Field(() => Float)
  annual: number;

  @Field(() => Float, { nullable: true })
  tax?: number;
}

@InputType()
export class SubscriptionPlanFeatureInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class CreateSubscriptionPlanDto {
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
