import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class UpdateAgentDto {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    agentType?: string;

    @Field({ nullable: true })
    avatar?: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    goal?: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    additionalInfo?: any;

    @Field({ nullable: true })
    interactiveMode?: string;

    @Field({ nullable: true })
    parentAgentId?: string;

    @Field({ nullable: true })
    isOnline?: boolean;

    @Field({ nullable: true })
    status?: string;
}
