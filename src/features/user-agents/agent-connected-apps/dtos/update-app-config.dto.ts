import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class UpdateAppConfigDto {
    @Field()
    id: string;

    @Field(() => GraphQLJSONObject)
    config: any;
}
