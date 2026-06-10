import { Field, InputType } from '@nestjs/graphql';
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
}
