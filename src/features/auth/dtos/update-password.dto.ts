import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class UpdatePasswordDto {
  @Field()
  id: string;

  @Field()
  password: string;
}
