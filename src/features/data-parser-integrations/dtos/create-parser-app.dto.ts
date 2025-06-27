import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateParserAppDto {

  @Field()
  name: string;

  @Field()
  appCode: string;

  @Field({ nullable: true })
  description: string;

  @Field({nullable: true})
  logo: string;

  @Field({nullable: true})
  readMore: string;

  @Field(() => GraphQLJSONObject, {nullable: true})
  details: any;

}
