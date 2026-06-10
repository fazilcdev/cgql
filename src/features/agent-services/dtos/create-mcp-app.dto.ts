import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateMcpAppDto {

  @Field()
  fId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  appCode: string;

  @Field({ nullable: true })
  logo: string;

  @Field({ nullable: true })
  deviceType: string;

  @Field({ nullable: true })
  readMore: string;

  @Field({ nullable: true })
  provider: string;

  @Field(() => [String], { nullable: true })
  requiredScopes: string[];

  @Field(() => [String], { nullable: true })
  tags: string[];

  @Field(() => GraphQLJSONObject, { nullable: true })
  details: any;

}
