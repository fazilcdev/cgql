import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../../common/authentication/guards/gql-auth.guard';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { UserAgents } from 'chatbuk-common/dist/services/user-agents/services';
import { GraphQLError } from 'graphql';
import { Agent } from '../types/agent.type';
import { CreateAgentDto } from '../dtos/create-agent.dto';
import { UpdateAgentDto } from '../dtos/update-agent.dto';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { Organization } from '../types/organization.type';
import { TokenUser } from '../../../common/authentication/decorators/tokenUser.decorator';

@Resolver()
export class CommandResolver {
    constructor(private readonly nats: NatsClientService) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(returns => Agent)
    async createAgent(
        @Args({ name: 'data', type: () => CreateAgentDto }) data: CreateAgentDto,
        @TokenUser() user: any,
    ) {
        const agent = await this.nats
            .sendSync(RPCServices.UserAgents, UserAgents.CreateAgentCommand, {
                data: data,
                tokenUser: user,
            })
            .catch(e => {
                console.error('CreateAgent error:', e);
                throw new GraphQLError(e.message || JSON.stringify(e));
            });

        if (agent) {
            if (agent.createdAt) agent.createdAt = new Date(agent.createdAt);
            if (agent.updatedAt) agent.updatedAt = new Date(agent.updatedAt);
            if (agent.lastActive) agent.lastActive = new Date(agent.lastActive);
        }
        return agent;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(returns => Agent)
    async updateAgent(
        @Args({ name: 'id', type: () => String }) id: string,
        @Args({ name: 'data', type: () => UpdateAgentDto }) data: UpdateAgentDto,
        @TokenUser() user: any,
    ) {
        const agent = await this.nats
            .sendSync(RPCServices.UserAgents, UserAgents.UpdateAgentCommand, {
                id: id,
                data: data,
                tokenUser: user,
            })
            .catch(e => {
                throw new GraphQLError(e.message);
            });

        if (agent) {
            if (agent.createdAt) agent.createdAt = new Date(agent.createdAt);
            if (agent.updatedAt) agent.updatedAt = new Date(agent.updatedAt);
            if (agent.lastActive) agent.lastActive = new Date(agent.lastActive);
        }
        return agent;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(returns => Agent)
    async deleteAgent(
        @Args({ name: 'id', type: () => String }) id: string,
        @TokenUser() user: any,
    ) {
        return await this.nats
            .sendSync(RPCServices.UserAgents, UserAgents.DeleteAgentCommand, {
                id: id,
                tokenUser: user,
            })
            .catch(e => {
                throw new GraphQLError(e.message);
            });
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(returns => Organization)
    async createOrganization(
        @Args({ name: 'data', type: () => CreateOrganizationDto }) data: CreateOrganizationDto,
        @TokenUser() user: any,
    ) {
        const org = await this.nats
            .sendSync(RPCServices.UserAgents, UserAgents.CreateOrganizationCommand, {
                ownerId: user.id,
                name: data.name,
                slug: data.slug,
                description: data.description,
                tokenUser: user,
            })
            .catch(e => {
                throw new GraphQLError(e.message);
            });

        if (org) {
            org.createdAt = new Date(org.createdAt);
            org.updatedAt = new Date(org.updatedAt);
        }
        return org;
    }
}
