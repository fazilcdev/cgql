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
import { MobileVerificationType } from '../types/mobileVerification.type';

const APP_USER_AUTH_FIELDS = ['firstName', 'lastName', 'email'];

function appUserFieldsMap(fieldsMap: any) {
  if (!fieldsMap) return fieldsMap;

  const next = { ...fieldsMap };
  const authUserFields = typeof next.authUser === 'object' && next.authUser !== null
    ? { ...next.authUser }
    : {};

  let needsAuthUser = false;
  for (const field of APP_USER_AUTH_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(next, field)) {
      delete next[field];
      authUserFields[field] = false;
      needsAuthUser = true;
    }
  }

  if (needsAuthUser || Object.keys(authUserFields).length) {
    authUserFields.id = false;
    next.authUser = authUserFields;
  }

  return next;
}

function flattenAppUser(user: any) {
  if (!user) return user;

  const obj = typeof user.toObject === 'function'
    ? user.toObject()
    : typeof user.toJSON === 'function'
      ? user.toJSON()
      : { ...user };
  const authUser = obj.authUser;

  if (authUser && typeof authUser === 'object') {
    obj.firstName = authUser.firstName;
    obj.lastName = authUser.lastName;
    obj.email = authUser.email;
  }

  return obj;
}


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
        fieldsMap: appUserFieldsMap(fieldsMap),
      })
      .then(flattenAppUser)
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
        fieldsMap: appUserFieldsMap(fieldsMap),
      })
      .then(users => Array.isArray(users) ? users.map(flattenAppUser) : users)
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
}
