import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrganizationDto {
    // The owner is taken from the authenticated token server-side; clients don't supply it.
    @Field({ nullable: true })
    ownerId?: string;

    @Field()
    name: string;

    @Field()
    slug: string;

    @Field({ nullable: true })
    description?: string;
}
