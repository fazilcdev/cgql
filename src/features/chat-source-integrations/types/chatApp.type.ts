import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class ChatAppType {

    @Field()
    id: string;

    @Field()
    fId: string;

    @Field()
    name: string;

    @Field({nullable: true})
    appCode: string;
  
    @Field({ nullable: true })
    description: string;
  
    @Field({nullable: true})
    logo: string;
  
    @Field({nullable: true})
    deviceType: string;
  
    @Field({nullable: true})
    readMore: string;
  
    @Field(() => GraphQLJSONObject, {nullable: true})
    details: any;

}
