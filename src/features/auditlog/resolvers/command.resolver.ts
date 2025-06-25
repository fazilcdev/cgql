import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module'
import { RPCServices } from "chatbuk-common/dist/services/rpc-services";
import { Auditlog } from "chatbuk-common/dist/services/auditlog/services";
import { Int } from "@nestjs/graphql";
import { GraphQLJSONObject } from 'graphql-type-json';
import { DeleteDto } from "../../../common/dtos/delete.dto";
import { GraphQLError } from 'graphql';
import { UserLogType } from "../types/UserLog.type";
import { CreateUserLogDto } from "../dtos/create-UserLog.dto";
import { UpdateUserLogDto } from "../dtos/update-UserLog.dto";


@Resolver()
export class CommandResolver {

  constructor(
    private readonly nats: NatsClientService
  ) { }

  // Message_Patterns
  
// -------------------------  UserLog ------------------------------------------ //

  @Mutation(returns => UserLogType)
    async createUserLog(@Args('data') data: CreateUserLogDto) {
      return await this.nats.sendSync(RPCServices.Auditlog, Auditlog.CreateUserLogCommand, data).catch((e) => { throw new GraphQLError(e.messagee) });
  }

  @Mutation(returns => UserLogType)
    async updateUserLog(@Args('data') data: UpdateUserLogDto) {
      return await this.nats.sendSync(RPCServices.Auditlog, Auditlog.UpdateUserLogCommand, data).catch((e) => { throw new GraphQLError(e.message) });
  }

  @Mutation(returns => UserLogType)
    async deleteUserLog(@Args('data') data: DeleteDto) {
      return await this.nats.sendSync(RPCServices.Auditlog, Auditlog.DeleteUserLogCommand, data).catch((e) => { throw new GraphQLError(e.message) });
  }

  
}
