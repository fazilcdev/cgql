import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class OrganizationMemberPermissions {
    @Field(() => [String], { nullable: true })
    allowedAgentTypes?: string[];

    @Field({ nullable: true })
    canManageAgents?: boolean;

    @Field({ nullable: true })
    interactionMode?: string;
}

@ObjectType()
export class OrganizationMember {
    @Field(() => String)
    orgId: string;

    @Field(() => String)
    userId: string;

    @Field(() => [String])
    roles: string[];

    @Field(() => String)
    status: string;

    @Field(() => OrganizationMemberPermissions, { nullable: true })
    permissions?: OrganizationMemberPermissions;
}

@ObjectType()
export class Organization {
    @Field(() => ID)
    _id: string;

    @Field()
    name: string;

    @Field()
    slug: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    avatar?: string;

    @Field()
    ownerId: string;

    @Field()
    status: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field(() => OrganizationMember, { nullable: true })
    membership?: OrganizationMember;
}
