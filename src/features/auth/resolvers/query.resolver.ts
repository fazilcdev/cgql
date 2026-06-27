import { Resolver, Args, Query } from '@nestjs/graphql';
import { toGraphQLError } from '../../../common/errors/to-graphql-error';
import { Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { GqlFieldsMap } from 'chatbuk-common/dist/common/decorators/gql-fields-map.decorator';
import { GqlProjection } from 'chatbuk-common/dist/common/decorators/gql-projection.decorator';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { Auth } from 'chatbuk-common/dist/services/auth/services';

import { AccessTokenType } from '../types/accesstoken.type';

import { AuthUserType } from '../types/authuser.type';

import { ClientType } from '../types/client.type';

@Resolver()
export class QueryResolver {
  constructor(private readonly nats: NatsClientService) { }

  // Message_Patterns

  // -------------------------  Client ------------------------------------------ //

  @Query(returns => ClientType)
  async getOneClient(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Auth, Auth.GetOneClientQuery, {
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw toGraphQLError(e);
      });
  }

  @Query(returns => [ClientType])
  async getManyClients(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @Args({ name: 'sort', nullable: true, type: () => String }) sort: string,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Auth, Auth.GetManyClientsQuery, {
        limit: limit,
        skip: skip,
        sort: sort,
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw toGraphQLError(e);
      });
  }

  // -------------------------  AuthUser ------------------------------------------ //

  @Query(returns => AuthUserType, { nullable: true })
  async getOneAuthUser(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Auth, Auth.GetOneAuthUserQuery, {
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw toGraphQLError(e);
      });
  }

  @Query(returns => [AuthUserType], { nullable: true })
  async getManyAuthUsers(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @Args({ name: 'sort', nullable: true, type: () => String }) sort: string,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Auth, Auth.GetManyAuthUsersQuery, {
        limit: limit,
        skip: skip,
        sort: sort,
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw toGraphQLError(e);
      });
  }

  // Total users matching the same condition — drives admin pagination.
  @Query(returns => String, { nullable: true })
  async getAuthUsersCount(
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Auth, Auth.GetAuthUsersCount, {
        condition: condition,
      })
      .catch(e => {
        throw toGraphQLError(e);
      });
  }

  // -------------------------  AccessToken ------------------------------------------ //

  @Query(returns => AccessTokenType)
  async getOneAccessToken(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Auth, Auth.GetOneAccessTokenQuery, {
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw toGraphQLError(e);
      });
  }

  @Query(returns => [AccessTokenType])
  async getManyAccessTokens(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @Args({ name: 'sort', nullable: true, type: () => String }) sort: string,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Auth, Auth.GetManyAccessTokensQuery, {
        limit: limit,
        skip: skip,
        sort: sort,
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw toGraphQLError(e);
      });
  }
}
