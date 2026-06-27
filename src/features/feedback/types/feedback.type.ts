import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class FeedbackType {
  @Field()
  id: string;

  @Field({ nullable: true })
  fId?: string;

  @Field({ nullable: true })
  type?: string;

  @Field()
  message: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  createdAt?: string;

  @Field({ nullable: true })
  updatedAt?: string;
}
