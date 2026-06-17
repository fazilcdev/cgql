import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SendFeedbackDto {
  @Field()
  type: string;

  @Field()
  message: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  name?: string;
}
