import { Resolver, Args, Query } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { TokenUser } from '../../../common/authentication/decorators/tokenUser.decorator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { GqlFieldsMap } from 'chatbuk-common/dist/common/decorators/gql-fields-map.decorator';
import { GqlProjection } from 'chatbuk-common/dist/common/decorators/gql-projection.decorator';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { Users } from 'chatbuk-common/dist/services/users/services';
import { GraphQLError } from 'graphql';
import { AppUserType } from '../types/appUser.type';
import { UserType } from '../types/User.type';

import { MobileVerificationType } from '../types/mobileVerification.type';


@Resolver()
export class QueryResolver {
  constructor(private readonly nats: NatsClientService) { }

  

  // ...............................appUser....................................//

  @Query(returns => AppUserType, { nullable: true })
  async GetOneAppUser(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Users, Users.GetOneAppUserQuery, {
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

  //@ACRoles([ 'User','Admin', 'SuperAdmin'])
  @Query(returns => [AppUserType])
  async GetManyAppUser(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @Args({ name: 'sort', nullable: true, type: () => String }) sort: string,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Users, Users.GetManyAppUserQuery, {
        limit: limit,
        skip: skip,
        sort: sort,
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

  @Query(returns => String, { nullable: true })
  async GetAppUserCount(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject }) condition: any,
    @Args({ name: 'date', nullable: true, type: () => String }) date: string

  ) {
    return await this.nats
      .sendSync(RPCServices.Users, Users.GetAppUserCountQuery, {
        // limit: limit,
        // skip: skip,
        // sort: sort,
        condition: condition,
        fieldsMap: fieldsMap,
        date: date
      })
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }
  // // ...............................User....................................//

  @Query(returns => UserType, { nullable: true })
  async GetOneExecutiveUser(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Users, Users.GetOneExecutiveUserQuery, {
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

  //@ACRoles([ 'User','Admin', 'SuperAdmin'])
  @Query(returns => [UserType])
  async GetManyExecutiveUser(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'skip', nullable: true, type: () => Int }) skip: number,
    @Args({ name: 'sort', nullable: true, type: () => String }) sort: string,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Users, Users.GetManyExecutiveUserQuery, {
        limit: limit,
        skip: skip,
        sort: sort,
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }

  @Query(returns => String, { nullable: true })
  async GetExecutiveUserCount(
    @GqlFieldsMap() fieldsMap: any,
    @GqlProjection() projection,
    @Args({ name: 'condition', nullable: true, type: () => GraphQLJSONObject })
    condition: any,
  ) {
    return await this.nats
      .sendSync(RPCServices.Users, Users.GetExecutiveUserCountQuery, {
        // limit: limit,
        // skip: skip,
        // sort: sort,
        condition: condition,
        fieldsMap: fieldsMap,
      })
      .catch(e => {
        throw new GraphQLError(e.message);
      });
  }


}
