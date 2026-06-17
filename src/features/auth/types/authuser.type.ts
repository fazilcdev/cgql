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

  @Field({nullable:true})
  lastName: string;

  @Field({nullable:true})
  email: string;

  @Field({ nullable: true })
  mobile: string;

  @Field()
  isActive: boolean;

  @Field(() => [String], { nullable: true })
  roles: Array<any>;

  @Field({ nullable: true })
  createdAt: Date;
}
