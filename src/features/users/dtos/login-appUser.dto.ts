import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginAppUserDto {
  @Field()
  username: string;

  @Field()
  code: string;

  @Field()
  clientName: string;

  @Field()
  clientSecret: string;
}
