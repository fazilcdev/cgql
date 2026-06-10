import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType('McpApp')
export class McpApp {

    @Field()
    id: string;

    @Field()
    fId: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    appCode: string;

    @Field({ nullable: true })
    description: string;

    @Field({ nullable: true })
    logo: string;

    @Field({ nullable: true })
    deviceType: string;

    @Field({ nullable: true })
    readMore: string;

    @Field({ nullable: true })
    provider: string; // ID of provider

    @Field(() => [String], { nullable: true })
    requiredScopes: string[];

    @Field(() => [String], { nullable: true })
    tags: string[];

    @Field(() => GraphQLJSONObject, { nullable: true })
    details: any;

    @Field({ nullable: true })
    status: string;

    @Field({ nullable: true })
    createdAt: Date;

    @Field({ nullable: true })
    updatedAt: Date;

}
