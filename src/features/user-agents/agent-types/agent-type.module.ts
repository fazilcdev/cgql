import { Module } from '@nestjs/common';
import { AgentTypeResolver } from './resolvers/agent-type.resolver';

@Module({
    providers: [AgentTypeResolver],
    exports: []
})
export class AgentTypeModule { }
