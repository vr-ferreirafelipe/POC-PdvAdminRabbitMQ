/* eslint-disable sonarjs/no-duplicate-string */
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';
import axios from 'axios';

import { Global, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { GetSupermercadosWithEcfsUseCase } from '../supermercados/get-lojas.use-case';

@Injectable()
@Global()
export class RabbitMQService implements OnModuleInit {
  channels = new Map<string, ChannelWrapper>();

  constructor(
    private readonly getAllSupermercados: GetSupermercadosWithEcfsUseCase,
    private readonly logger: Logger
  ) {}

  async onModuleInit() {
    const supermercadoList = await this.getAllSupermercados.execute();

    for (const { idLoja, ecfs } of supermercadoList) {
      for (const { ecf } of ecfs) {
        const vhost = `${idLoja}.${ecf}`;
        await this.createVhost(vhost);
        await this.createQueuesAndExchanges(vhost);
      }
    }
  }

  async createVhost(vhost: string) {
    const url = `http://pocpdvadminrabbitmq-rabbit:15672/api/vhosts/${vhost}`;
    const auth = {
      username: 'rabbitmq',
      password: 'rabbitmq',
    };

    try {
      await axios.put(
        url,
        {},
        {
          auth,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      this.logger.log(`✅ Vhost ${vhost} criado com sucesso.`, RabbitMQService.name);
    } catch (error) {
      this.logger.error(`❌ Erro ao criar o vhost ${vhost}:`, RabbitMQService.name);
      this.logger.verbose(error, RabbitMQService.name);
    }
  }

  async createQueuesAndExchanges(vhost: string) {
    const connection = amqp.connect([
      `amqp://rabbitmq:rabbitmq@pocpdvadminrabbitmq-rabbit:5672/${vhost}`,
    ]);

    const channelWrapper: ChannelWrapper = connection.createChannel({
      json: true,
      setup: async (channel: ConfirmChannel) => {
        await channel.deleteExchange('solicitacoes.liberacao.ex');
        await channel.deleteQueue('solicitacoes.liberacao');
        await channel.deleteExchange('log.rejeicoes.ex');

        await channel.deleteExchange('solicitacoes.autorizacao.ex');
        await channel.deleteQueue('solicitacoes.autorizacao');

        await channel.assertExchange('solicitacoes.liberacao.ex', 'fanout');
        await channel.assertExchange('solicitacoes.autorizacao.ex', 'fanout');
        await channel.assertExchange('log.rejeicoes.ex', 'fanout');

        await channel.assertQueue('log.transacoes');
        await channel.assertQueue('log.rejeicoes');
        await channel.assertQueue('solicitacoes.liberacao', {
          deadLetterExchange: 'log.rejeicoes.ex',
          deadLetterRoutingKey: 'log.rejeicoes',
          messageTtl: 30000, // 30 s
          maxLength: 1, // maximo de msg
        });
        await channel.assertQueue('solicitacoes.autorizacao', {
          deadLetterExchange: 'log.rejeicoes.ex',
          deadLetterRoutingKey: 'log.rejeicoes',
          messageTtl: 30000, // 30 s
          maxLength: 1, // maximo de msg
        });

        await channel.bindQueue('log.transacoes', 'solicitacoes.liberacao.ex', 'log.transacoes');
        await channel.bindQueue(
          'solicitacoes.liberacao',
          'solicitacoes.liberacao.ex',
          'solicitacoes.liberacao'
        );
        await channel.bindQueue('log.transacoes', 'solicitacoes.autorizacao.ex', 'log.transacoes');
        await channel.bindQueue(
          'solicitacoes.liberacao',
          'solicitacoes.liberacao.ex',
          'solicitacoes.liberacao'
        );
        await channel.bindQueue('log.rejeicoes', 'log.rejeicoes.ex', 'log.rejeicoes');

        this.logger.log(`✅ Filas e exchanges criadas no ${vhost}.`, RabbitMQService.name);
      },
    });

    channelWrapper
      .consume(
        'solicitacoes.liberacao',
        (message: ConsumeMessage | null) => {
          if (message !== null) {
            try {
              console.log('consume vhost:', vhost);
              console.log('payload message', message.content.toString());

              console.log('message:', JSON.parse(message.content.toString()).message);
              console.log(JSON.parse(message.content.toString()).message);

              console.log(
                'Received message from solicitacoes.liberacao:',
                message.content.toString()
              );
              channelWrapper.ack(message);
              console.log('ACK');
            } catch (error) {
              channelWrapper.nack(message, false, false);
              console.log('NACK');
            }
          }
        },
        {
          noAck: false,
        }
      )
      .then(() => {
        this.logger.log(
          `✅ Listening for messages on solicitacoes.liberacao queue from ${vhost}.`,
          RabbitMQService.name
        );
      })
      .catch((error) => {
        this.logger.error(
          `❌ Error listening for messages on solicitacoes.liberacao queue from ${vhost}.`,
          RabbitMQService.name
        );
        this.logger.verbose(error, RabbitMQService.name);
      });

    // Aguarde a conexão
    await channelWrapper.waitForConnect();

    this.channels.set(vhost, channelWrapper);
  }
}
