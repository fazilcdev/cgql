import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  global['config'] = await dotenv.config().parsed;

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      url: global['config'].NATS_URL,
      maxReconnectAttempts: -1,
      //@ts-ignore
      // waitOnFirstConnect: true,
      queue: `${global['config'].APP_NAME}-${global['config'].NODE_ENV}`,
    },
  });

  process.title = global['config'].APP_NAME;
  // await app.startAllMicroservicesAsync();
  app.setGlobalPrefix(`${global['config'].APP_NAME}`);
  await app.listen(global['config'].PORT,);
}
bootstrap();
