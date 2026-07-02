import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';

@ObjectType('Agent')
export class Agent {
    @Field()
    id: string;

    @Field()
    fId: string;

    @Field({ nullable: true })
    authUser: string; // ID of authUser

    @Field()
    name: string;

    @Field()
    agentType: string; // ID of AgentType or populated object if handled

    @Field({ nullable: true })
    ownerOrgId?: string; // ID of Organization

    // connectedApps removed in favor of AgentConnectedApp entity
    @Field({ nullable: true })
    avatar: string;

    @Field({ nullable: true })
    avatarColor?: string;

    @Field({ nullable: true })
    description: string;

    @Field({ nullable: true })
    goal: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    additionalInfo: any;

    @Field(() => GraphQLJSON, { nullable: true })
    subChats?: any;

    @Field()
    interactiveMode: string;

    @Field({ nullable: true })
    parentAgentId: string;

    @Field({ nullable: true })
    lastActive: Date;

    @Field({ nullable: true })
    isOnline: boolean;

    @Field()
    status: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
