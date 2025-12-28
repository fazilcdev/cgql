import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NatsClientService } from 'selfpod-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'selfpod-common/dist/services/rpc-services';
import { Auth } from 'selfpod-common/dist/services/auth/services';
import { GraphQLError } from 'graphql';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly nats: NatsClientService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('verify-google-login')
  async verifyGoogleLogin(@Body() data: any) {
    return await this.nats
      .sendSync(RPCServices.Auth, Auth.GoogleLoginCommand, data)
      .catch(e => {
        console.log(e.message)
        throw new GraphQLError(e.message)
      });
  }
}
