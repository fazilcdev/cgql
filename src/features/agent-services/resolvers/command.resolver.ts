import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../../common/authentication/guards/gql-auth.guard';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { McpApp } from 'chatbuk-common/dist/services/agent-service/entities';
import { Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { DeleteDto } from '../../../common/dtos/delete.dto';
import { toGraphQLError } from '../../../common/errors/to-graphql-error';

import { ACRoles } from '../../../common/access-controll/decorators/ac-roles.decorator';
import { TokenUser } from '../../../common/authentication/decorators/tokenUser.decorator';
import { McpApp as McpAppType } from '../types/mcpApp.type';
import { UpdateMcpAppDto } from '../dtos/update-mcp-app.dto';
import { CreateMcpAppDto } from '../dtos/create-mcp-app.dto';
import { CreateChatMessageDto } from '../dtos/create-chat-message.dto';
import { SendChatMessageDto } from '../dtos/send-chat-message.dto';
import { ChatMessageType } from '../types/chat-message.type';

@Resolver()
export class CommandResolver {
  constructor(private readonly nats: NatsClientService) { }

  // Message_Patterns

  // -------------------------  Mcp App ------------------------------------------ //

  //@ACRoles(['Admin', 'SuperAdmin'])
  @UseGuards(GqlAuthGuard)
  @Mutation(returns => McpAppType)
  async createMcpApp(
    @Args('data') data: CreateMcpAppDto,
    @TokenUser() user: any,
  ) {
    return await this.nats
      .sendSync(
        RPCServices.AgentService,
        McpApp.CreateMcpAppCommand,
        { data: data, tokenUser: user },
      )
      .catch(e => {
        console.log('e', e)
        throw toGraphQLError(e);
      });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => McpAppType)
  async updateMcpApp(
    @Args('data') data: UpdateMcpAppDto,
    @TokenUser() user: any,

  ) {
    return await this.nats
      .sendSync(
        RPCServices.AgentService,
        McpApp.UpdateMcpAppCommand,
        { data: data, tokenUser: user },
      )
      .catch(e => {
        throw toGraphQLError(e);
      });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => McpAppType)
  async deleteMcpApp(
    @Args('data') data: DeleteDto,
    @TokenUser() user: any,
  ) {
    return await this.nats
      .sendSync(
        RPCServices.AgentService,
        McpApp.DeleteMcpAppCommand,
        { data: data, tokenUser: user },
      )
      .catch(e => {
        throw toGraphQLError(e);
      });
  }

  // -------------------------  Chat Message ------------------------------------------ //

  //@ACRoles(['Admin', 'SuperAdmin', 'User'])
  @UseGuards(GqlAuthGuard)
  @Mutation(returns => ChatMessageType)
  async createChatMessage(
    @Args('data') data: CreateChatMessageDto,
    @TokenUser() user: any,
  ) {
    const payload = {
      ...data,
      inputs: { ...data, text: data.text } // Ensure inputs structure matches what ChatMessage expects
    };
    return await this.nats
      .sendSync(
        RPCServices.AgentService,
        McpApp.CreateChatMessageCommand,
        { data: payload, tokenUser: user },
      )
      .catch(e => {
        console.log('e', e)
        throw toGraphQLError(e);
      });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async deleteTransaction(
    @Args('id') id: string,
    @TokenUser() user: any,
  ) {
    return await this.nats
      .sendSync(
        RPCServices.AgentService,
        McpApp.DeleteTransactionCommand,
        { data: { id }, tokenUser: user },
      )
      .catch(e => {
        throw toGraphQLError(e);
      });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async sendChatMessage(
    @Args('data') data: SendChatMessageDto,
    @TokenUser() user: any,
  ) {
    return await this.nats
      .sendSync(
        RPCServices.AgentService,
        McpApp.SendChatMessageCommand,
        { data, tokenUser: user },
      )
      .catch(e => {
        console.log('Send chat message error:', e);
        throw toGraphQLError(e);
      });
  }
}
