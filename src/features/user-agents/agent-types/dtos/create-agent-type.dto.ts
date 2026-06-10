import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateAgentTypeDto {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    icon?: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    defaultConfig?: any;

    @Field({ nullable: true })
    status?: string;
}
