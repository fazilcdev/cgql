import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateAppVersionDto {


  @Field()
  type: string;

  @Field()
  updation: boolean;

  @Field()
  message: string;

  @Field()
  version: number;

}
