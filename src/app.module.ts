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
import { AppController } from './features/app.controller';
import { SubscriptionModule } from './features/subscription/subscription.module';
import { ContactModule } from './features/webPage/contact.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ChatAppModule } from './features/chat-source-integrations/chatApp.module';
import { DestinationAppModule } from './features/destination-app-integrations/destinationapp.module';
import { ParserAppModule } from './features/data-parser-integrations/parserapp.module';


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
    }),
    UsersModule,
    AuthModule,
    AuditlogModule,
    SubscriptionModule,
    ContactModule,
    ChatAppModule,
    DestinationAppModule,
    ParserAppModule,
    HttpModule
  ],
  controllers: [
    AppController
  ],
  providers: [
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
