import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateEntryDto } from './create-entry.dto';

@InputType()
export class UpdateEntryDto extends PartialType(CreateEntryDto) {
    @Field()
    fId: string;
}
