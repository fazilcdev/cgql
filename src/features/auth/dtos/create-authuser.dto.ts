import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateAuthUserDto {
  @Field()
  fId: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  mobile: string;

  @Field()
  password: string;

  @Field()
  isActive: boolean;
}
