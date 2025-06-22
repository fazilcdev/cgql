import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginExecutiveUserDto {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  clientName: string;

  @Field()
  clientSecret: string;
}
