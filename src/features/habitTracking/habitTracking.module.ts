import { Module } from '@nestjs/common';
import { HabitTrackingCommandResolver } from './resolvers/command.resolver';
import { HabitTrackingQueryResolver } from './resolvers/query.resolver';

@Module({
    providers: [
        HabitTrackingCommandResolver,
        HabitTrackingQueryResolver,
    ],
})
export class HabitTrackingModule { }
