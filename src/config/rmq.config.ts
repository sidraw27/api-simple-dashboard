import { Transport } from '@nestjs/microservices';
import { registerAs } from '@nestjs/config';

export default registerAs('rmq', () => ({
  transport: Transport.RMQ,
  options: {
    urls: [
      `amqp://${process.env.RMQ_USERNAME}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_URL}:${process.env.RMQ_PORT}`,
    ],
    queueOptions: {
      durable: true,
    },
    noAck: false,
    queue: process.env.RMQ_QUEUE,
  },
}));
