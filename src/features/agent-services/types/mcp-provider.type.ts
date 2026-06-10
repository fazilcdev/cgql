import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('McpProvider')
export class McpProvider {

    @Field()
    id: string; // Internal MongoDB ID

    @Field()
    providerId: string; // The "code" e.g. 'google'

    @Field()
    name: string;

    @Field()
    clientId: string;

    @Field()
    clientSecret: string;

    @Field({ nullable: true })
    authUrl: string;

    @Field({ nullable: true })
    tokenUrl: string;

    @Field(() => [String], { nullable: true })
    scopes: string[];

    @Field({ nullable: true })
    createdAt: Date;

    @Field({ nullable: true })
    updatedAt: Date;
}
