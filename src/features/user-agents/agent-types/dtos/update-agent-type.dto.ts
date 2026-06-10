import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateAgentTypeDto } from './create-agent-type.dto';

@InputType()
export class UpdateAgentTypeDto extends PartialType(CreateAgentTypeDto) { }
