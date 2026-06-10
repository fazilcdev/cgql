import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginExecutiveUserDto {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  clientName: string;

  @Field()
  clientSecret: string;
}
