import { Injectable } from '@nestjs/common';

import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class RegisterSupermercadoUseCase {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async execute({ idLoja, ecfs }: { idLoja: number; ecfs: { ecf: number }[] }) {
    for (const { ecf } of ecfs) {
      const vhost = `${idLoja}.${ecf}`;
      await this.rabbitMQService.createVhost(vhost);
      await this.rabbitMQService.createQueuesAndExchanges(vhost);
    }
  }
}
