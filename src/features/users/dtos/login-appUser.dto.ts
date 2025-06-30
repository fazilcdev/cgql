import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginAppUserDto {
  @Field()
  mobile: string;

  @Field()
  code: string;

  @Field()
  clientName: string;

  @Field()
  clientSecret: string;
}
