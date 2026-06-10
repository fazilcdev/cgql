import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateHabitDto {
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
    type: string;

    @Field(type => [Int], { defaultValue: [0, 1, 2, 3, 4, 5, 6] })
    weekdays: number[];

    @Field(type => Float, { nullable: true })
    goalValue?: number;

    @Field({ defaultValue: false })
    isAutomatic: boolean;

    @Field(type => GraphQLJSONObject, { nullable: true })
    autoCriteria?: any;

    @Field({ defaultValue: true })
    isActive: boolean;
}
