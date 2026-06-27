import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { HabitTracking } from 'chatbuk-common/dist/services/habit-tracking/services';
import { toGraphQLError } from '../../../common/errors/to-graphql-error';
import { HabitType } from '../types/habit.type';
import { EntryType } from '../types/entry.type';
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';

@Resolver()
export class HabitTrackingQueryResolver {
    constructor(private readonly nats: NatsClientService) { }

    @Query(returns => HabitType, { nullable: true })
    async getHabit(@Args('condition', { type: () => GraphQLJSONObject }) condition: any) {
        return await this.nats
            .sendSync(RPCServices.HabitTracking, HabitTracking.GetOneHabitQuery, { condition })
            .catch(e => {
                throw toGraphQLError(e);
            });
    }

    @Query(returns => [HabitType])
    async getHabits(
        @Args('condition', { type: () => GraphQLJSONObject, nullable: true }) condition: any,
        @Args('limit', { type: () => Int, nullable: true }) limit: number,
        @Args('skip', { type: () => Int, nullable: true }) skip: number,
        @Args('sort', { type: () => GraphQLJSONObject, nullable: true }) sort: any,
    ) {
        return await this.nats
            .sendSync(RPCServices.HabitTracking, HabitTracking.GetManyHabitsQuery, { condition, limit, skip, sort })
            .catch(e => {
                throw toGraphQLError(e);
            });
    }

    @Query(returns => Int)
    async getHabitsCount(@Args('condition', { type: () => GraphQLJSONObject, nullable: true }) condition: any) {
        return await this.nats
            .sendSync(RPCServices.HabitTracking, HabitTracking.GetHabitsCountQuery, { condition })
            .catch(e => {
                throw toGraphQLError(e);
            });
    }

    @Query(returns => EntryType, { nullable: true })
    async getEntry(@Args('condition', { type: () => GraphQLJSONObject }) condition: any) {
        return await this.nats
            .sendSync(RPCServices.HabitTracking, HabitTracking.GetOneEntryQuery, { condition })
            .catch(e => {
                throw toGraphQLError(e);
            });
    }

    @Query(returns => [EntryType])
    async getEntries(
        @Args('condition', { type: () => GraphQLJSONObject, nullable: true }) condition: any,
        @Args('limit', { type: () => Int, nullable: true }) limit: number,
        @Args('skip', { type: () => Int, nullable: true }) skip: number,
        @Args('sort', { type: () => GraphQLJSONObject, nullable: true }) sort: any,
    ) {
        return await this.nats
            .sendSync(RPCServices.HabitTracking, HabitTracking.GetManyEntriesQuery, { condition, limit, skip, sort })
            .catch(e => {
                throw toGraphQLError(e);
            });
    }

    @Query(returns => Int)
    async getEntriesCount(@Args('condition', { type: () => GraphQLJSONObject, nullable: true }) condition: any) {
        return await this.nats
            .sendSync(RPCServices.HabitTracking, HabitTracking.GetEntriesCountQuery, { condition })
            .catch(e => {
                throw toGraphQLError(e);
            });
    }
}
