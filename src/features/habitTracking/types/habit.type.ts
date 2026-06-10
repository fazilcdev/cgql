import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class HabitType {
    @Field(type => ID)
    fId: string;

    @Field()
    userId: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    templateId?: string;

    @Field({ nullable: true })
    place?: string;

    @Field({ nullable: true })
    time?: string;

    @Field({ nullable: true })
    penalty?: string;

    @Field(type => Int)
    priority: number;

    @Field()
    type: string; // 'binary' | 'numeric'

    @Field(type => [Int], { nullable: true })
    weekdays: number[];

    @Field(type => Float, { nullable: true })
    goalValue?: number;

    @Field()
    isAutomatic: boolean;

    @Field(type => GraphQLJSON, { nullable: true })
    autoCriteria?: any;

    @Field()
    isActive: boolean;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
