import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateMcpAppDto } from './create-mcp-app.dto';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class UpdateMcpAppDto extends PartialType(CreateMcpAppDto) {

  @Field()
  id: string;

}
