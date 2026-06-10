import { Resolver, Args, Query } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { GqlFieldsMap } from 'chatbuk-common/dist/common/decorators/gql-fields-map.decorator';
import { GqlProjection } from 'chatbuk-common/dist/common/decorators/gql-projection.decorator';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { UserAgents } from 'chatbuk-common/dist/services/user-agents/services';
import { GraphQLError } from 'graphql';
import { Agent } from '../types/agent.type';
import { Organization } from '../types/organization.type';

@Resolver()
export class QueryResolver {
    constructor(private readonly nats: NatsClientService) { }

    @Query(returns => String, { nullable: true })
    async getAgentCount(
        @GqlFieldsMap() fieldsMap: any,
        @GqlProjection() projection,
        @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
        condition: any,
    ) {
        return await this.nats
            .sendSync(RPCServices.UserAgents, UserAgents.GetAgentCountQuery, {
                condition: condition,
                fieldsMap: fieldsMap,
            })
            .catch(e => {
                throw new GraphQLError(e.message);
            });
    }

    @Query(returns => Agent, { nullable: true })
    async getOneAgent(
        @GqlFieldsMap() fieldsMap: any,
        @GqlProjection() projection,
        @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
        condition: any,
    ) {
        const agent = await this.nats
            .sendSync(RPCServices.UserAgents, UserAgents.GetOneAgentQuery, {
                condition: condition,
                fieldsMap: fieldsMap,
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

    @Query(returns => [Agent])
    async getManyAgents(
        @GqlFieldsMap() fieldsMap: any,
        @GqlProjection() projection,
        @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
        @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
        @Args({ name: 'sort', nullable: true, type: () => String }) sort: string,
        @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
        condition: any,
    ) {
        const agents = await this.nats
            .sendSync(RPCServices.UserAgents, UserAgents.GetManyAgentsQuery, {
                limit: limit,
                skip: skip,
                sort: sort,
                condition: condition,
                fieldsMap: fieldsMap,
            })
            .catch(e => {
                console.log(e.message);
                throw new GraphQLError(e.message);
            });

        return agents.map(agent => {
            if (agent.createdAt) agent.createdAt = new Date(agent.createdAt);
            if (agent.updatedAt) agent.updatedAt = new Date(agent.updatedAt);
            if (agent.lastActive) agent.lastActive = new Date(agent.lastActive);
            return agent;
        });
    }

    @Query(returns => [Organization])
    async getUserOrganizations(
        @Args({ name: 'userId', type: () => String }) userId: string,
    ) {
        const orgs = await this.nats
            .sendSync(RPCServices.UserAgents, UserAgents.GetUserOrganizationsQuery, {
                userId: userId,
            })
            .catch(e => {
                throw new GraphQLError(e.message);
            });

        return orgs.map(org => {
            if (org.createdAt) org.createdAt = new Date(org.createdAt);
            if (org.updatedAt) org.updatedAt = new Date(org.updatedAt);
            return org;
        });
    }
}
