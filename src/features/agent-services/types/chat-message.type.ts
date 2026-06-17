import { Field, ObjectType, ID } from '@nestjs/graphql';
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class ChatMessageType {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    messageId?: string;

    @Field({ nullable: true })
    incomingMessageId?: string;

    @Field({ nullable: true })
    agentId?: string;

    @Field({ nullable: true })
    chatId?: string;

    @Field({ nullable: true })
    message?: string;

    @Field({ nullable: true })
    messageType?: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    inputs?: any;

    @Field(() => GraphQLJSONObject, { nullable: true })
    result?: any;

    @Field(() => GraphQLJSONObject, { nullable: true })
    rich?: any;

    @Field(() => GraphQLJSON, { nullable: true })
    recordRefs?: any;

    @Field(() => GraphQLJSONObject, { nullable: true })
    replyTo?: any;

    @Field(() => GraphQLJSONObject, { nullable: true })
    tempResult?: any;

    @Field({ nullable: true })
    status?: string;

    @Field({ nullable: true })
    statusLabel?: string;

    @Field({ nullable: true })
    mediaUrl?: string;

    @Field({ nullable: true })
    role?: string;



    @Field({ nullable: true })
    mcpApp?: string;

    @Field({ nullable: true })
    authUser?: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    sender?: any;

    @Field({ nullable: true })
    createdAt?: Date;
}
