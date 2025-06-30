import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class DestinationAppCredentialType {

    @Field({nullable: true})
    expiryDate: number;

    @Field()
    fId: string;
}
