import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class UpdateUserWalletByAdminDto {
  @Field()
  customer: string;

  @Field()
  plan: string;

}
