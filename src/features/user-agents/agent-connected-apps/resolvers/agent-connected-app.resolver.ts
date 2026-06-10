import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { UserAgents } from 'chatbuk-common/dist/services/user-agents/services';
import { AgentConnectedApp } from '../types/agent-connected-app.type';
import { ConnectAppDto } from '../dtos/connect-app.dto';

@Resolver(() => AgentConnectedApp)
export class AgentConnectedAppResolver {
    constructor(private readonly nats: NatsClientService) { }

    @Mutation(() => AgentConnectedApp)
    async connectAppToAgent(@Args('data') data: ConnectAppDto) {
        return this.nats.sendSync(RPCServices.UserAgents, UserAgents.ConnectAppCommand, data);
    }

    @Mutation(() => AgentConnectedApp)
    async disconnectAppFromAgent(@Args('id') id: string) {
        return this.nats.sendSync(RPCServices.UserAgents, UserAgents.DisconnectAppCommand, { id });
    }

    @Query(() => [AgentConnectedApp])
    async getAgentConnectedApps(@Args('agentId') agentId: string) {
        return this.nats.sendSync(RPCServices.UserAgents, UserAgents.GetAgentConnectedAppsQuery, { agentId });
    }
}
