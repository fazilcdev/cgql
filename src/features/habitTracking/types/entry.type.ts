import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class EntryType {
    @Field(type => ID)
    fId: string;

    @Field()
    userId: string;

    @Field()
    date: string;

    @Field()
    type: string;

    @Field(type => GraphQLJSON)
    value: any;

    @Field({ nullable: true })
    referenceId?: string;

    @Field(type => GraphQLJSON, { nullable: true })
    metadata?: any;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
