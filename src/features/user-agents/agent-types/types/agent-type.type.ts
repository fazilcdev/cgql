import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType('AgentType')
export class AgentType {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description: string;

    @Field({ nullable: true })
    icon: string;

    @Field({ nullable: true })
    image: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    defaultConfig: any;

    @Field()
    status: string;

    @Field({ nullable: true })
    createdAt: Date;

    @Field({ nullable: true })
    updatedAt: Date;
}
