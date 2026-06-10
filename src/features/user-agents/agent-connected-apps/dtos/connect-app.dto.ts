import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class ConnectAppDto {
    @Field()
    agent: string;

    @Field()
    mcpApp: string;

    @Field({ nullable: true })
    context?: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    config?: any;

    @Field({ nullable: true, defaultValue: true })
    isEnabled?: boolean;

    @Field({ nullable: true })
    status?: string;
}
