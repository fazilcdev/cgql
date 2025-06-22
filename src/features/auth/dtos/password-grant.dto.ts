import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PasswordGrantDto {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  clientName: string;

  @Field()
  clientSecret: string;
}
