import compression from 'compression';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { bootstrap } from './main';

jest.mock('@nestjs/config', () => ({
  ConfigService: {
    get: jest.fn(),
  },
  ConfigModule: {
    forRoot: jest.fn(),
  },
}));

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(() => ({
      setGlobalPrefix: jest.fn().mockReturnThis(),
      useGlobalPipes: jest.fn().mockReturnThis(),
      enableCors: jest.fn().mockReturnThis(),
      listen: jest.fn().mockReturnThis(),
      getUrl: jest.fn().mockReturnThis(),
      use: jest.fn().mockReturnThis(),
      get: jest.fn((arg) => (arg === ConfigService ? ConfigService : Logger)),
    })),
  },
}));

jest.mock('express', () => ({
  json: jest.fn(),
  urlencoded: jest.fn(),
}));

jest.mock('helmet');
jest.mock('compression');

describe('App Bootstrap', () => {
  let appMock: jest.Mocked<INestApplication>;

  beforeEach(() => {
    appMock = {
      setGlobalPrefix: jest.fn().mockReturnThis(),
      useGlobalPipes: jest.fn().mockReturnThis(),
      enableCors: jest.fn().mockReturnThis(),
      listen: jest.fn().mockReturnThis(),
      getUrl: jest.fn().mockReturnThis(),
      use: jest.fn().mockReturnThis(),
      get: jest.fn((arg) => (arg === ConfigService ? ConfigService : Logger)),
    } as unknown as jest.Mocked<INestApplication>;

    (NestFactory.create as jest.Mock).mockReturnValue(appMock);
  });

  it('deve definir um prefixo global', async () => {
    await bootstrap();
    expect(appMock.setGlobalPrefix).toHaveBeenCalledTimes(1);
    expect(appMock.setGlobalPrefix).toHaveBeenCalledWith('api/v1');
  });

  it('deve usar o json com "limit" de 50mb', async () => {
    await bootstrap();
    expect(json).toHaveBeenCalledTimes(1);
    expect(appMock.use).toHaveBeenCalledWith(json({ limit: '50mb' }));
  });

  it('deve usar "urlencoded" com os atributos "extended" true e "limit" 50mb', async () => {
    await bootstrap();
    expect(urlencoded).toHaveBeenCalledTimes(1);
    expect(appMock.use).toHaveBeenCalledWith(urlencoded({ extended: true, limit: '50mb' }));
  });

  it('deve usar o "helmet"', async () => {
    await bootstrap();
    expect(helmet).toHaveBeenCalledTimes(1);
    expect(appMock.use).toHaveBeenCalledWith(helmet());
  });

  it('deve usar o "compression"', async () => {
    await bootstrap();
    expect(compression).toHaveBeenCalledTimes(1);
    expect(appMock.use).toHaveBeenCalledWith(compression());
  });

  it('deve usar o "enableCors"', async () => {
    await bootstrap();
    expect(appMock.enableCors).toHaveBeenCalledTimes(1);
  });
});
