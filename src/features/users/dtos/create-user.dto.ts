import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateUserDto {

  @Field()
  firstName: string;

  @Field({ nullable: true })
  address: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  mobile: string;

  @Field()
  password: string;

  @Field()
  isActive: boolean;
}
