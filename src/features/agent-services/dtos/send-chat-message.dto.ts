import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class SendChatMessageDto {
    @Field()
    agentId: string;

    @Field()
    message: string;

    @Field({ nullable: true })
    mediaUrl?: string;

    @Field({ nullable: true })
    messageType?: string;

    @Field({ nullable: true })
    interactiveMode?: boolean;

    @Field({ nullable: true })
    isPrivate?: boolean;

    @Field({ nullable: true })
    tempId?: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    inputs?: any;

    @Field(() => GraphQLJSONObject, { nullable: true })
    agentRuntimeContext?: any;

    // Domain-pack context (finance/notes/custom...) and tenancy/thread scoping. workspaceId is
    // authorized server-side in agent-service; an unauthorized value falls back to personal.
    // `domain` is the pack key; `domainPack` is the data-driven DomainPackConfig from the agent
    // type (dashboard-created verticals). See docs/rich-view-contract.md.
    @Field({ nullable: true })
    domain?: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    domainPack?: any;

    @Field({ nullable: true })
    workspaceId?: string;

    @Field({ nullable: true })
    chatId?: string;

    // WhatsApp-style reply context. Carries the quoted message + any record id(s) it is linked to
    // ({ id, content, role, recordRefs? }) so the agent can edit/delete the RIGHT existing record.
    @Field(() => GraphQLJSONObject, { nullable: true })
    replyTo?: any;
}
