import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { IbapUserType } from '../../users/types/ibapUser.type';
import { AuthUserType } from '../../auth/types/authuser.type';

@ObjectType()
export class IbapUserLogType {

  @Field()
  id: string;

  @Field()
  action: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

  @Field({ nullable: true })
  entity: string;

  @Field(() => AuthUserType, { nullable: true })
  authUser: any;

  @Field(() => GraphQLJSONObject, { nullable: true })
  oldValue: any;

  @Field(() => GraphQLJSONObject, { nullable: true })
  newValue: any;



}