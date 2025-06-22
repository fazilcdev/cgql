import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateUserSubscriptionDto {

  @Field()
  plan: string;

  @Field({nullable: true})
  email: string;

  @Field({nullable: true})
  version: string;

}
