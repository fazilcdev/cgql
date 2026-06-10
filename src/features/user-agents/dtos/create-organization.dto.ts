import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrganizationDto {
    @Field()
    ownerId: string;

    @Field()
    name: string;

    @Field()
    slug: string;

    @Field({ nullable: true })
    description?: string;
}
