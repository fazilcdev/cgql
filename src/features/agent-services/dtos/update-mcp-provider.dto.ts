import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateMcpProviderDto } from './create-mcp-provider.dto';

@InputType()
export class UpdateMcpProviderDto extends PartialType(CreateMcpProviderDto) {

    @Field()
    id: string;

}
