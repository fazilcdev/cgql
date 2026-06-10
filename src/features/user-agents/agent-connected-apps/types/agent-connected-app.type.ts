import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType('AgentConnectedApp')
export class AgentConnectedApp {
    @Field()
    id: string;

    @Field()
    agent: string; // Ref ID

    @Field()
    mcpApp: string; // Ref ID or Object (we can resolve it later)

    @Field({ nullable: true })
    context: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    config: any;

    @Field({ defaultValue: true })
    isEnabled: boolean;

    @Field()
    status: string;

    @Field({ nullable: true })
    createdAt: Date;

    @Field({ nullable: true })
    updatedAt: Date;
}
