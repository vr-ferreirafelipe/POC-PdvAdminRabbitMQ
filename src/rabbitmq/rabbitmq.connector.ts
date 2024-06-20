// import client, { Connection } from 'amqplib';

// import { Global, Injectable, Logger } from '@nestjs/common';

// @Injectable()
// @Global()
// export default class RabbitMQConnection {
//   connection!: Connection;
//   connected: boolean = false;

//   constructor(private readonly logger: Logger) {}

//   async connect() {
//     if (this.connected) {
//       return;
//     }

//     try {
//       this.logger.log('⌛️ Connecting to Rabbit-MQ Server', RabbitMQConnection.name);
//       this.connection = await client.connect(
//         'amqp://rabbitmq:rabbitmq@pocpdvadminrabbitmq-rabbit:5672'
//       );

//       this.logger.log('✅ Rabbit MQ Connection is ready', RabbitMQConnection.name);

//       // console.log(`🛸 Created RabbitMQ Channel successfully`);
//     } catch (error) {
//       this.logger.error('❌ Not connected to MQ Server', RabbitMQConnection.name);
//     }
//   }
// }
