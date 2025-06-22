import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class AttachRoleDto {
  @Field()
  id: string;

  @Field(() => [String])
  roles: Array<string>;
}
