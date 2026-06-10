import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginAppUserDto {
  @Field()
  email: string;

  @Field()
  code: string;

  @Field()
  clientName: string;

  @Field()
  clientSecret: string;
}
