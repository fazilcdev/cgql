import { IsMongoId } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteDto {
  @Field(() => String)
  @IsMongoId()
  id: string;
}
