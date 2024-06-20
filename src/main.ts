import compression from 'compression';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app
    .setGlobalPrefix('api/v1')
    .use(json({ limit: '50mb' }))
    .use(urlencoded({ extended: true, limit: '50mb' }))
    .use(helmet())
    .use(compression())
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      })
    );
  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService?.get<number>('PORT') ?? 3000;

  await app.listen(port);
  const logger = app.get(Logger);
  logger.log(`Application is running on: ${await app.getUrl()}`, 'MainBootstrap');
}

bootstrap();
