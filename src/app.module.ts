import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { GetSupermercadosWithEcfsUseCase } from './supermercados/get-lojas.use-case';
import { RegisterSupermercadoUseCase } from './supermercados/post-loja.use-case';
import { SupermercadoController } from './supermercados/supermercado.controller';

const isDevEnv = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'developement';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isDevEnv ? '.env.dev' : `.env`,
    }),
  ],
  controllers: [SupermercadoController],
  providers: [
    Logger,
    RegisterSupermercadoUseCase,
    GetSupermercadosWithEcfsUseCase,
    RabbitMQService,
  ],
})
export class AppModule {}
