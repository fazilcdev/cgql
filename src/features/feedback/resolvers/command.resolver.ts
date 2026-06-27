import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { Users } from 'chatbuk-common/dist/services/users/services';
import { toGraphQLError } from '../../../common/errors/to-graphql-error';
import { SendFeedbackDto } from '../dtos/send-feedback.dto';

@Resolver()
export class CommandResolver {
  constructor(private readonly nats: NatsClientService) {}

  // Forwards feedback to the users service, which emails it to support over SMTP.
  @Mutation(() => Boolean)
  async sendFeedback(@Args('data') data: SendFeedbackDto): Promise<boolean> {
    const res: any = await this.nats
      .sendSync(RPCServices.Users, Users.SendFeedbackCommand, data)
      .catch((e) => {
        throw toGraphQLError(e);
      });
    return Boolean(res?.ok ?? res);
  }
}
