import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateAgentDto {
    @Field({ nullable: true })
    ownerOrgId?: string;
    @Field()
    userId: string;

    @Field()
    name: string;

    @Field()
    agentType: string;

    @Field({ nullable: true })
    avatar?: string;

    @Field({ nullable: true })
    avatarColor?: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    goal?: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    additionalInfo?: any;

    /** Optional business context (mode/industry/businessName/notes). Normalized + stored under
     *  additionalInfo.businessProfile by the create handler. Not gated by any plan/org. */
    @Field(() => GraphQLJSONObject, { nullable: true })
    businessProfile?: any;

    @Field({ defaultValue: 'enabled' })
    interactiveMode: string;

    @Field({ nullable: true })
    parentAgentId?: string;
}
