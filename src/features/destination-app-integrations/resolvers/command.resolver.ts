import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { DestinationApp } from 'chatbuk-common/dist/services/destination-app-integrations/services';
import { Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { DeleteDto } from '../../../common/dtos/delete.dto';
import { GraphQLError } from 'graphql';

import { ACRoles } from '../../../common/access-controll/decorators/ac-roles.decorator';
import { TokenUser } from '../../../common/authentication/decorators/tokenUser.decorator';
import { DestinationAppType } from '../types/destinationApp.type';
import { UpdateDestinationAppDto } from '../dtos/update-destination-app.dto';
import { CreateDestinationAppDto } from '../dtos/create-destination-app.dto';
import { DestinationAppCredentialType } from '../types/destinationAppCredential.type';
import { CheckUserHasAppDto } from '../dtos/check-user-has-app.dto';

@Resolver()
export class CommandResolver {
  constructor(private readonly nats: NatsClientService) {}

  // -------------------------  DestinationApp ------------------------------------------ //

  //@ACRoles(['Admin', 'SuperAdmin'])
  @Mutation(returns => DestinationAppType)
  async createDestinationApp(
    @Args('data') data: CreateDestinationAppDto,
    @TokenUser() user: any,
    ) {
    return await this.nats
      .sendSync(
        RPCServices.DestinationApp, 
        DestinationApp.CreateDestinationAppCommand, 
        { data: data, tokenUser: user },
      )
      .catch(e => {
        console.log('e', e)
        throw new GraphQLError(e.message);
      });
  }

  //@ACRoles(['Admin', 'SuperAdmin'])
  @Mutation(returns => DestinationAppType)
  async updateDestinationApp(
    @Args('data') data: UpdateDestinationAppDto,
    @TokenUser() user: any,

    ) {
    return await this.nats
      .sendSync(
        RPCServices.DestinationApp, 
        DestinationApp.UpdateDestinationAppCommand, 
        { data: data, tokenUser: user },
      )
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

  //@ACRoles(['Admin', 'SuperAdmin'])
  @Mutation(returns => DestinationAppType)
  async deleteDestinationApp(
    @Args('data') data: DeleteDto,
    @TokenUser() user: any,
    ) {
    return await this.nats
      .sendSync(
        RPCServices.DestinationApp, 
        DestinationApp.DeleteDestinationAppCommand, 
        { data: data, tokenUser: user },
      )
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

  @Mutation(returns => DestinationAppCredentialType, { nullable: true })
  async checkUserHasApp(
    @Args('data') data: CheckUserHasAppDto,
    @TokenUser() user: any,
    ) {
    return await this.nats
      .sendSync(
        RPCServices.DestinationApp, 
        DestinationApp.CheckUserHasLeastOneAppCommand, 
        { data: data, tokenUser: user },
      )
      .catch(e => {
        console.log('e', e)
        throw new GraphQLError(e.message);
      });
  }

}
