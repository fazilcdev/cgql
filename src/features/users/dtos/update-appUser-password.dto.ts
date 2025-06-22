import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateAppUserPasswordDto {

  @Field()
  code: string;

  @Field()
  mobileNo: string;

  @Field()
  password: string;

}