import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetManyTransactionsQueryDto {
    @Field(() => Int, { nullable: true })
    limit?: number;

    @Field(() => Int, { nullable: true })
    skip?: number;

    @Field({ nullable: true })
    sort?: string;

    @Field({ nullable: true })
    type?: string;

    @Field({ nullable: true })
    agentId?: string;
}
