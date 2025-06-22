import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AuthUserType } from '../../auth/types/authuser.type';

@ObjectType()
export class UserWalletType {

  @Field()
  id: string;

  @Field()
  total_free_coin_used: number;

  @Field()
  total_coins: number;

  @Field()
  used_coins: number;

  @Field(()=>AuthUserType)
  authUser: any;

}
