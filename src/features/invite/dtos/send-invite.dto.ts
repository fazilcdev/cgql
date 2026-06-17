import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SendInviteDto {
  @Field()
  email: string;

  @Field({ nullable: true })
  inviterName?: string;

  @Field({ nullable: true })
  inviterEmail?: string;
}
