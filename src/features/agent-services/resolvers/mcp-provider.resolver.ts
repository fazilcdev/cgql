import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { McpProviderPatterns } from 'chatbuk-common/dist/services/agent-service/entities';
import { McpProvider } from '../types/mcp-provider.type';
import { CreateMcpProviderDto } from '../dtos/create-mcp-provider.dto';
import { UpdateMcpProviderDto } from '../dtos/update-mcp-provider.dto';
import { GraphQLJSONObject } from 'graphql-type-json';

@Resolver(of => McpProvider)
export class McpProviderResolver {

    constructor(private readonly natsClient: NatsClientService) { }

    @Query(returns => [McpProvider])
    async getMcpProviders(
        @Args('limit', { nullable: true, defaultValue: 20 }) limit: number,
        @Args('skip', { nullable: true, defaultValue: 0 }) skip: number,
        @Args('sort', { nullable: true, type: () => GraphQLJSONObject }) sort: any,
        @Args('condition', { nullable: true, type: () => GraphQLJSONObject }) condition: any
    ) {
        const providers = await this.natsClient
            .sendSync(RPCServices.AgentService, McpProviderPatterns.GetManyMcpProviderQuery, {
                limit, skip, sort, condition
            });
        return providers.map(p => ({ ...p, id: p._id }));
    }

    @Query(returns => Number)
    async getMcpProviderCount(
        @Args('condition', { nullable: true, type: () => GraphQLJSONObject }) condition: any
    ) {
        return await this.natsClient
            .sendSync(RPCServices.AgentService, McpProviderPatterns.GetMcpProviderCountQuery, {
                condition
            });
    }

    @Query(returns => McpProvider, { nullable: true })
    async getOneMcpProvider(
        @Args('condition', { type: () => GraphQLJSONObject }) condition: any
    ) {
        const provider = await this.natsClient
            .sendSync(RPCServices.AgentService, McpProviderPatterns.GetOneMcpProviderQuery, {
                condition
            });
        return provider ? { ...provider, id: provider._id } : null;
    }

    @Mutation(returns => McpProvider)
    async createMcpProvider(
        @Args('data') data: CreateMcpProviderDto
    ) {
        const provider = await this.natsClient
            .sendSync(RPCServices.AgentService, McpProviderPatterns.CreateMcpProviderCommand, {
                data
            });
        return { ...provider, id: provider._id };
    }

    @Mutation(returns => McpProvider)
    async updateMcpProvider(
        @Args('data') data: UpdateMcpProviderDto
    ) {
        const provider = await this.natsClient
            .sendSync(RPCServices.AgentService, McpProviderPatterns.UpdateMcpProviderCommand, {
                data
            });
        return { ...provider, id: provider._id };
    }

    @Mutation(returns => McpProvider)
    async deleteMcpProvider(
        @Args('id') id: string
    ) {
        const provider = await this.natsClient
            .sendSync(RPCServices.AgentService, McpProviderPatterns.DeleteMcpProviderCommand, {
                data: { id }
            });
        return { ...provider, id: provider._id };
    }

}
