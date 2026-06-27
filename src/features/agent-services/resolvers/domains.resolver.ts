import { Resolver, Query } from '@nestjs/graphql';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { Domains } from 'chatbuk-common/dist/services/agent-service/entities';
import { toGraphQLError } from '../../../common/errors/to-graphql-error';
import { DomainOption } from '../types/domain-option.type';

/**
 * Read-only catalog of engine-supported domains, sourced from agent-service's DomainPackRegistry.
 * Used by the admin agent-type form to populate the domain picker and prefill each domain's in-code
 * system prompt as an editable reference.
 */
@Resolver(() => DomainOption)
export class DomainsResolver {
  constructor(private readonly nats: NatsClientService) {}

  @Query(() => [DomainOption])
  async getDomains() {
    return this.nats
      .sendSync(RPCServices.AgentService, Domains.ListDomainsQuery, {})
      .catch((e) => {
        throw toGraphQLError(e);
      });
  }
}
