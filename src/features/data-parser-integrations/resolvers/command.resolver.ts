import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { ChatDataParser } from 'chatbuk-common/dist/services/chat-data-parser/services';
import { Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { DeleteDto } from '../../../common/dtos/delete.dto';
import { GraphQLError } from 'graphql';

import { ACRoles } from '../../../common/access-controll/decorators/ac-roles.decorator';
import { TokenUser } from '../../../common/authentication/decorators/tokenUser.decorator';
import { ParserAppType } from '../types/parserApp.type';
import { UpdateParserAppDto } from '../dtos/update-parser-app.dto';
import { CreateParserAppDto } from '../dtos/create-parser-app.dto';

@Resolver()
export class CommandResolver {
  constructor(private readonly nats: NatsClientService) {}

  // Message_Patterns

  // -------------------------  Parser App ------------------------------------------ //

  //@ACRoles(['Admin', 'SuperAdmin'])
  @Mutation(returns => ParserAppType)
  async createParserApp(
    @Args('data') data: CreateParserAppDto,
    @TokenUser() user: any,
    ) {
    return await this.nats
      .sendSync(
        RPCServices.ChatDataParser, 
        ChatDataParser.CreateParserAppCommand, 
        { data: data, tokenUser: user },
      )
      .catch(e => {
        console.log('e', e)
        throw new GraphQLError(e.message);
      });
  }

  //@ACRoles(['Admin', 'SuperAdmin'])
  @Mutation(returns => ParserAppType)
  async updateParserApp(
    @Args('data') data: UpdateParserAppDto,
    @TokenUser() user: any,

    ) {
    return await this.nats
      .sendSync(
        RPCServices.ChatDataParser, 
        ChatDataParser.UpdateParserAppCommand, 
        { data: data, tokenUser: user },
      )
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

  //@ACRoles(['Admin', 'SuperAdmin'])
  @Mutation(returns => ParserAppType)
  async deleteParserApp(
    @Args('data') data: DeleteDto,
    @TokenUser() user: any,
    ) {
    return await this.nats
      .sendSync(
        RPCServices.ChatDataParser, 
        ChatDataParser.DeleteParserAppCommand, 
        { data: data, tokenUser: user },
      )
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

}
