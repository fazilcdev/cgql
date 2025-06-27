import { InputType, Field } from "@nestjs/graphql";
import { GraphQLJSONObject } from 'graphql-type-json';


@InputType()
export class CreateUserLogDto {

  

  @Field()
  action: string;

  @Field()
  entity: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  oldValue: any;

  @Field(() => GraphQLJSONObject, { nullable: true })
  newValue: any;

}

