import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { WebPage } from 'chatbuk-common/dist/services/webpage/services';
import { Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { DeleteDto } from '../../../common/dtos/delete.dto';
import { GraphQLError } from 'graphql';
import { ContactPageType } from '../types/contactPage.type';
import { CreateContactPageDto } from '../dtos/create-contactPage.dto'
import { AppVersionType } from '../types/appVersion.type';
import { CreateAppVersionDto } from '../dtos/create-app-version.dto';


@Resolver()
export class CommandResolver {
  constructor(private readonly nats: NatsClientService) {}

  // Message_Patterns

  // -------------------------  Client ------------------------------------------ //

  //@ACRoles(['SuperAdmin'])
  @Mutation(returns => ContactPageType)
  async createContactPage(@Args('data') data: CreateContactPageDto) {
    return await this.nats
      .sendSync(RPCServices.WebPage, WebPage.CreateContactUsPageCommand, data)
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

  // -------------------------  App Version ------------------------------------------ //

  //@ACRoles(['SuperAdmin'])
  @Mutation(returns => AppVersionType)
  async createAppVersion(@Args('data') data: CreateAppVersionDto) {
    return await this.nats
      .sendSync(RPCServices.WebPage, WebPage.CreateAppVersionCommand, data)
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

  
}
