import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { UserAgents } from 'chatbuk-common/dist/services/user-agents/services';
import { AgentType } from '../types/agent-type.type';
import { CreateAgentTypeDto } from '../dtos/create-agent-type.dto';
import { UpdateAgentTypeDto } from '../dtos/update-agent-type.dto';

@Resolver(() => AgentType)
export class AgentTypeResolver {
    constructor(private readonly nats: NatsClientService) { }

    @Mutation(() => AgentType)
    async createAgentType(@Args('data') data: CreateAgentTypeDto) {
        return this.nats.sendSync(RPCServices.UserAgents, UserAgents.CreateAgentTypeCommand, data);
    }

    @Mutation(() => AgentType)
    async updateAgentType(
        @Args('id') id: string,
        @Args('data') data: UpdateAgentTypeDto
    ) {
        return this.nats.sendSync(RPCServices.UserAgents, UserAgents.UpdateAgentTypeCommand, { id, ...data });
    }

    @Mutation(() => AgentType)
    async deleteAgentType(@Args('id') id: string) {
        return this.nats.sendSync(RPCServices.UserAgents, UserAgents.DeleteAgentTypeCommand, { id });
    }

    @Query(() => [AgentType])
    async getAgentTypes() {
        return this.nats.sendSync(RPCServices.UserAgents, UserAgents.GetAgentTypesQuery, {});
    }
}
