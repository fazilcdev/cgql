import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  global['config'] = { ...process.env, ...(dotenv.config().parsed || {}) };

  const app = await NestFactory.create(AppModule);

  // Security headers. Disable CSP/COEP so the GraphQL Playground/IDE still loads in dev.
  app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

  // CORS: lock to an allowlist in production; reflect origin in dev for convenience.
  const allowed = (global['config'].ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (allowed.length > 0) {
    app.enableCors({ origin: allowed, credentials: true });
  } else {
    console.warn('[security] ALLOWED_ORIGINS not set — reflecting request origin (dev only).');
    app.enableCors({ origin: true, credentials: true });
  }
  // No `whitelist` here: this is the GraphQL gateway and the GraphQL schema
  // already rejects any field not declared on an @InputType, so whitelist adds
  // no protection — it only silently strips DTO properties that lack
  // class-validator decorators (which left @Args() DTOs arriving empty).
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
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
