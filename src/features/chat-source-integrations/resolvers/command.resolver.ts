import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { ChatApp } from 'chatbuk-common/dist/services/chat-source-integrations/services';
import { Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { DeleteDto } from '../../../common/dtos/delete.dto';
import { GraphQLError } from 'graphql';

import { ACRoles } from '../../../common/access-controll/decorators/ac-roles.decorator';
import { TokenUser } from '../../../common/authentication/decorators/tokenUser.decorator';
import { ChatAppType } from '../types/chatApp.type';
import { UpdateChatAppDto } from '../dtos/update-chat-app.dto';
import { CreateChatAppDto } from '../dtos/create-chat-app.dto';

@Resolver()
export class CommandResolver {
  constructor(private readonly nats: NatsClientService) {}

  // Message_Patterns

  // -------------------------  Chat App ------------------------------------------ //

  //@ACRoles(['Admin', 'SuperAdmin'])
  @Mutation(returns => ChatAppType)
  async createChatApp(
    @Args('data') data: CreateChatAppDto,
    @TokenUser() user: any,
    ) {
    return await this.nats
      .sendSync(
        RPCServices.ChatApp, 
        ChatApp.CreateChatAppCommand, 
        { data: data, tokenUser: user },
      )
      .catch(e => {
        console.log('e', e)
        throw new GraphQLError(e.message);
      });
  }

  //@ACRoles(['Admin', 'SuperAdmin'])
  @Mutation(returns => ChatAppType)
  async updateChatApp(
    @Args('data') data: UpdateChatAppDto,
    @TokenUser() user: any,

    ) {
    return await this.nats
      .sendSync(
        RPCServices.ChatApp, 
        ChatApp.UpdateChatAppCommand, 
        { data: data, tokenUser: user },
      )
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

  //@ACRoles(['Admin', 'SuperAdmin'])
  @Mutation(returns => ChatAppType)
  async deleteChatApp(
    @Args('data') data: DeleteDto,
    @TokenUser() user: any,
    ) {
    return await this.nats
      .sendSync(
        RPCServices.ChatApp, 
        ChatApp.DeleteChatAppCommand, 
        { data: data, tokenUser: user },
      )
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

}
