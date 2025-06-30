import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginExecutiveUserDto {
  @Field()
  mobile: string;

  @Field()
  password: string;

  @Field()
  clientName: string;

  @Field()
  clientSecret: string;
}
