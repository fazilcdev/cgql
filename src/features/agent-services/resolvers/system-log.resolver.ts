import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';
import { GraphQLError } from 'graphql';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { SystemLogs } from 'chatbuk-common/dist/services/agent-service/entities';
import { GqlAuthGuard } from '../../../common/authentication/guards/gql-auth.guard';
import { ACRolesGuard } from '../../../common/access-controll/guards/ac-roles.guard';
import { ACRoles } from '../../../common/access-controll/decorators/ac-roles.decorator';

/**
 * Operational system logs — admin observability of agent backend behavior (LLM calls,
 * stages, errors). Admin-only; contains NO user content. This resolver only forwards
 * over NATS to agent-service; authorization is enforced here at the gateway.
 */
@Resolver()
export class SystemLogResolver {
  constructor(private readonly nats: NatsClientService) {}

  private call(cmd: string, payload: any) {
    return this.nats
      .sendSync(RPCServices.AgentService, cmd, payload)
      .catch((e) => {
        throw new GraphQLError(e.message);
      });
  }

  @UseGuards(GqlAuthGuard, ACRolesGuard)
  @ACRoles(['Admin', 'Super Admin'])
  @Query(() => GraphQLJSON, { nullable: true })
  async systemLogs(
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return this.call(SystemLogs.GetManySystemLogsQuery, {
      limit,
      skip,
      condition,
    });
  }

  @UseGuards(GqlAuthGuard, ACRolesGuard)
  @ACRoles(['Admin', 'Super Admin'])
  @Query(() => GraphQLJSON, { nullable: true })
  async systemLogsCount(
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return this.call(SystemLogs.GetSystemLogsCountQuery, { condition });
  }
}
