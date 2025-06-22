import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateClientDto {
  @Field()
  fId: string;

  @Field()
  name: string;

  @Field()
  secret: string;

  @Field()
  type: string;

  @Field()
  isActive: boolean;
}
