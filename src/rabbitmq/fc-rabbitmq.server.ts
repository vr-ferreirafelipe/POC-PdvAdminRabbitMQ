// import { Connection, Channel, connect, Message } from 'amqplib';

// import { Global, Injectable, OnModuleInit } from '@nestjs/common';

// @Injectable()
// @Global()
// export default class RabbitmqServer implements OnModuleInit {
//   private conn!: Connection;
//   private channel!: Channel;

//   constructor(private uri: string) {}

//   onModuleInit() {
//     this.start();
//   }

//   async start(): Promise<void> {
//     this.conn = await connect(this.uri);
//     this.channel = await this.conn.createChannel();
//   }

//   async publishInQueue(queue: string, message: string) {
//     return this.channel.sendToQueue(queue, Buffer.from(message));
//   }

//   async publishInExchange(exchange: string, routingKey: string, message: string): Promise<boolean> {
//     return this.channel.publish(exchange, routingKey, Buffer.from(message));
//   }

//   async consume(queue: string, callback: (message: Message) => void) {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     return this.channel.consume(queue, (message: any) => {
//       callback(message);
//       this.channel.ack(message);
//     });
//   }
// }
