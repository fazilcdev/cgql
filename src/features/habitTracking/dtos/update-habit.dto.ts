import { InputType, Field, Float, Int, PartialType } from '@nestjs/graphql';
import { CreateHabitDto } from './create-habit.dto';

@InputType()
export class UpdateHabitDto extends PartialType(CreateHabitDto) {
    @Field()
    fId: string;
}
