import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMcpProviderDto {

    @Field()
    providerId: string;

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

}
