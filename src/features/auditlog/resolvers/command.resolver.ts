import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { toGraphQLError } from '../../../common/errors/to-graphql-error';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module'
import { RPCServices } from "chatbuk-common/dist/services/rpc-services";
import { Auditlog } from "chatbuk-common/dist/services/auditlog/services";
import { Int } from "@nestjs/graphql";
import { GraphQLJSONObject } from 'graphql-type-json';
import { DeleteDto } from "../../../common/dtos/delete.dto";
import { UserLogType } from "../types/userLog.type";
import { CreateUserLogDto } from "../dtos/create-userLog.dto";
import { UpdateUserLogDto } from "../dtos/update-userLog.dto";

@Resolver()
export class CommandResolver {

  constructor(
    private readonly nats: NatsClientService
  ) { }

  // Message_Patterns

  // -------------------------  UserLog ------------------------------------------ //

  @Mutation(returns => UserLogType)
  async createUserLog(@Args('data') data: CreateUserLogDto) {
    return await this.nats.sendSync(RPCServices.Auditlog, Auditlog.CreateUserLogCommand, data).catch((e) => { throw toGraphQLError(e) });
  }

  @Mutation(returns => UserLogType)
  async updateUserLog(@Args('data') data: UpdateUserLogDto) {
    return await this.nats.sendSync(RPCServices.Auditlog, Auditlog.UpdateUserLogCommand, data).catch((e) => { throw toGraphQLError(e) });
  }

  @Mutation(returns => UserLogType)
  async deleteUserLog(@Args('data') data: DeleteDto) {
    return await this.nats.sendSync(RPCServices.Auditlog, Auditlog.DeleteUserLogCommand, data).catch((e) => { throw toGraphQLError(e) });
  }


}
