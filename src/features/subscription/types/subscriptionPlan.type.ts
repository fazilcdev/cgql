import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SubscriptionPlanPricingType {
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

@ObjectType()
export class SubscriptionPlanFeatureType {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class SubscriptionPlanType {
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

  @Field(() => [SubscriptionPlanPricingType])
  pricing: SubscriptionPlanPricingType[];

  @Field(() => [SubscriptionPlanFeatureType], { nullable: true })
  features?: SubscriptionPlanFeatureType[];

  @Field({ nullable: true })
  createdAt?: string;

  @Field({ nullable: true })
  updatedAt?: string;
}
