import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthenticationModule } from './common/authentication/authentication.module';
import { CacheModule } from './common/cache/cache.module';
// import { ACModule } from './common/access-controll/ac.module';
import { APP_GUARD } from '@nestjs/core';
import { ACRolesGuard } from './common/access-controll/guards/ac-roles.guard';
import { GqlAuthGuard } from './common/authentication/guards/gql-auth.guard';
import { NatsClientModule } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { ACModule } from './common/access-controll/ac.module';
import { AuditlogModule } from './features/auditlog/auditlog.module';
import { SubscriptionModule } from './features/subscription/subscription.module';
import { ContactModule } from './features/webpage/contact.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AgentServicesModule } from './features/agent-services/agent-services.module';
import { HabitTrackingModule } from './features/habitTracking/habitTracking.module';
import { AgentModule } from './features/user-agents/agent.module';
import { MediaModule } from './features/media/media.module';
import { AgentTypeModule } from './features/user-agents/agent-types/agent-type.module';
import { AgentConnectedAppGraphQLModule } from './features/user-agents/agent-connected-apps/agent-connected-app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DateTimeScalar } from './common/scalars/datetime.scalar';

@Module({
  imports: [
    CacheModule,
    AuthenticationModule,
    NatsClientModule,
    ACModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(__dirname, 'schema.gql'),
      context: ({ req }) => ({ req }),
      playground: true,
      useGlobalPrefix: true,
    }),
    UsersModule,
    AuthModule,
    AuditlogModule,
    SubscriptionModule,
    ContactModule,
    AgentServicesModule,
    // DestinationAppModule,
    // ParserAppModule,
    HabitTrackingModule,
    AgentModule,
    AgentTypeModule,
    AgentConnectedAppGraphQLModule,
    MediaModule,
    HttpModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    DateTimeScalar
    // {
    //   provide: APP_GUARD,
    //   useClass: GqlAuthGuard
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: ACRolesGuard
    // }
  ],
})
export class AppModule { }
