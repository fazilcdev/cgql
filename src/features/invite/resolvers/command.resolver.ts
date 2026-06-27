import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { Users } from 'chatbuk-common/dist/services/users/services';
import { toGraphQLError } from '../../../common/errors/to-graphql-error';
import { SendInviteDto } from '../dtos/send-invite.dto';

@Resolver()
export class CommandResolver {
  constructor(private readonly nats: NatsClientService) {}

  // Forwards the invite to the users service, which emails an HTML invite over SMTP.
  @Mutation(() => Boolean)
  async sendInvite(@Args('data') data: SendInviteDto): Promise<boolean> {
    const res: any = await this.nats
      .sendSync(RPCServices.Users, Users.SendInviteCommand, data)
      .catch((e) => {
        throw toGraphQLError(e);
      });
    return Boolean(res?.ok ?? res);
  }
}
