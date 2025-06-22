import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateIbapUserPasswordDto {

  @Field()
  code: string;

  @Field()
  mobileNo: string;

  @Field()
  password: string;

}