import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CheckUserHasAppDto {

  @Field()
  authUser: string;

}
