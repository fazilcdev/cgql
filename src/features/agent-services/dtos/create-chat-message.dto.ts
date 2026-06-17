import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateChatMessageDto {
    @Field()
    mcpApp: string;

    @Field({ nullable: true })
    agentId?: string;

    @Field({ nullable: true })
    messageType?: string; // 'text', 'image', 'voice'

    @Field({ nullable: true })
    inputs?: string; // JSON string because inputs is Mixed in schema, or define specific fields

    @Field({ nullable: true })
    mediaUrl?: string;

    @Field({ nullable: true })
    role?: string;

    @Field({ nullable: true })
    text?: string;

    @Field({ nullable: true })
    interactiveMode?: boolean;

    @Field({ nullable: true })
    isPrivate?: boolean;

    @Field({ nullable: true })
    tempId?: string;

    @Field({ nullable: true })
    workspaceId?: string;

    @Field({ nullable: true })
    chatId?: string;
}
