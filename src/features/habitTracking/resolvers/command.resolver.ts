import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { HabitTracking } from 'chatbuk-common/dist/services/habit-tracking/services';
import { toGraphQLError } from '../../../common/errors/to-graphql-error';
import { HabitType } from '../types/habit.type';
import { EntryType } from '../types/entry.type';
import { CreateHabitDto } from '../dtos/create-habit.dto';
import { UpdateHabitDto } from '../dtos/update-habit.dto';
import { CreateEntryDto } from '../dtos/create-entry.dto';
import { UpdateEntryDto } from '../dtos/update-entry.dto';
import { DeleteDto } from '../../../common/dtos/delete.dto';

@Resolver()
export class HabitTrackingCommandResolver {
    constructor(private readonly nats: NatsClientService) { }

    @Mutation(returns => HabitType)
    async createHabit(@Args('data') data: CreateHabitDto) {
        return await this.nats
            .sendSync(RPCServices.HabitTracking, HabitTracking.CreateHabitCommand, data)
            .catch(e => {
                throw toGraphQLError(e);
            });
    }

    @Mutation(returns => HabitType)
    async updateHabit(@Args('data') data: UpdateHabitDto) {
        return await this.nats
            .sendSync(RPCServices.HabitTracking, HabitTracking.UpdateHabitCommand, data)
            .catch(e => {
                throw toGraphQLError(e);
            });
    }

    @Mutation(returns => HabitType)
    async deleteHabit(@Args('data') data: DeleteDto) {
        return await this.nats
            .sendSync(RPCServices.HabitTracking, HabitTracking.DeleteHabitCommand, data)
            .catch(e => {
                throw toGraphQLError(e);
            });
    }

    @Mutation(returns => EntryType)
    async createEntry(@Args('data') data: CreateEntryDto) {
        return await this.nats
            .sendSync(RPCServices.HabitTracking, HabitTracking.CreateEntryCommand, data)
            .catch(e => {
                throw toGraphQLError(e);
            });
    }

    @Mutation(returns => EntryType)
    async updateEntry(@Args('data') data: UpdateEntryDto) {
        return await this.nats
            .sendSync(RPCServices.HabitTracking, HabitTracking.UpdateEntryCommand, data)
            .catch(e => {
                throw toGraphQLError(e);
            });
    }

    @Mutation(returns => EntryType)
    async deleteEntry(@Args('data') data: DeleteDto) {
        return await this.nats
            .sendSync(RPCServices.HabitTracking, HabitTracking.DeleteEntryCommand, data)
            .catch(e => {
                throw toGraphQLError(e);
            });
    }
}
