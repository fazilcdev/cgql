import { Module } from '@nestjs/common';
import { Resolvers } from './resolvers';
import { RecordsExportController } from './controllers/records-export.controller';

@Module({
  imports: [],
  controllers: [RecordsExportController],
  providers: [...Resolvers],
})
export class AgentServicesModule { }