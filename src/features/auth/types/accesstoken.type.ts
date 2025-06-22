import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AuthUserType } from './authuser.type';
import { ClientType } from './client.type';

@ObjectType()
export class AccessTokenType {
  @Field()
  id: string;

  @Field()
  token: string;

  @Field()
  expiry: Date;

  @Field()
  isRevoked: boolean;

  @Field(() => AuthUserType)
  authUser: any;

  @Field(() => ClientType)
  client: any;
}
