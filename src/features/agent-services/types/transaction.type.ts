import { Field, ObjectType, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class TransactionType {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    agentId?: string;

    @Field()
    type: string;

    @Field()
    content: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    metadata?: any;

    @Field({ nullable: true })
    vectorId?: string;

    @Field({ nullable: true })
    status?: string;

    @Field({ nullable: true })
    createdAt?: Date;
}
