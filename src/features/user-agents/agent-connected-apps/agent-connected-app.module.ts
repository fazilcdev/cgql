import { Module } from '@nestjs/common';
import { AgentConnectedAppResolver } from './resolvers/agent-connected-app.resolver';

@Module({
    providers: [AgentConnectedAppResolver],
    exports: []
})
export class AgentConnectedAppGraphQLModule { }
