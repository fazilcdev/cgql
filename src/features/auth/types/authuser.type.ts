import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class AuthUserType {
  @Field({nullable: true})
  id: string;

  @Field()
  fId: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  mobile: string;

  @Field()
  password: string;

  @Field()
  isActive: boolean;

  @Field(() => [String], { nullable: true })
  roles: Array<any>;
}
