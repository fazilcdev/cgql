import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class ParserAppType {

    @Field()
    name: string;

    @Field()
    appCode: string;
  
    @Field({ nullable: true })
    description: string;
  
    @Field({nullable: true})
    logo: string;
  
    @Field({nullable: true})
    readMore: string;
  
    @Field(() => GraphQLJSONObject, {nullable: true})
    details: any;

}
