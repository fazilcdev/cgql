import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class CreateEntryDto {
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
}
