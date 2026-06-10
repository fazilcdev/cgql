
import { InputType, Field, Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class GetManyChatMessagesQueryDto {
    @Field(() => GraphQLJSONObject, { nullable: true })
    condition?: any;

    @Field(() => Int, { nullable: true })
    limit?: number;

    @Field(() => Int, { nullable: true })
    skip?: number;

    @Field(() => GraphQLJSONObject, { nullable: true })
    sort?: any;

    @Field(() => GraphQLJSONObject, { nullable: true })
    fieldsMap?: any;
}
