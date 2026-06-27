import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import { Auth } from 'chatbuk-common/dist/services/auth/services';
import { toGraphQLError } from './common/errors/to-graphql-error';

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
        throw toGraphQLError(e)
      });
  }

  // Second step of a 2FA login: exchange the short-lived challenge token + TOTP code
  // (returned by verify-google-login when requires2fa is true) for a real access token.
  @Post('verify-2fa-login')
  async verify2faLogin(@Body() data: any) {
    return await this.nats
      .sendSync(RPCServices.Auth, Auth.Verify2faLoginCommand, data)
      .catch(e => {
        throw toGraphQLError(e)
      });
  }
}
