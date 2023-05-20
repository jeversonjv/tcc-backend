import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message } from 'amqplib';
import {
  connect,
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';

@Injectable()
export class RabbitMQServer implements OnModuleInit, OnApplicationShutdown {
  private logger = new Logger(RabbitMQServer.name);

  private url: string;
  private connection: AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;

  constructor(private configService: ConfigService) {}

  async start(): Promise<void> {
    if (!this.channelWrapper) {
      const url = this.configService.get<string>('rabbitmq.url');
      this.url = url;
      this.connection = connect([this.url]);
      this.channelWrapper = this.connection.createChannel();

      this.connection.on('connect', () => {
        this.logger.log('Connected to RabbitMQ');
      });
    }
  }

  async close(): Promise<void> {
    if (this.channelWrapper) {
      this.channelWrapper.close();
    }
  }

  async onModuleInit(): Promise<void> {
    await this.start();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.close();
  }

  async addSetup(queue: string, handle: any): Promise<void> {
    this.logger.log(`Add setup to queue ${queue}`);

    this.channelWrapper.addSetup((channel) => {
      return Promise.all([
        channel.assertQueue(queue),
        channel.consume(queue, (message) => {
          this.logger.log(
            `Message received: ${message.content.toString()} on queue ${queue}`,
          );
          handle.process(message);
          channel.ack(message);
        }),
      ]);
    });
  }

  async publishInQueue(queue: string, message: string) {
    await this.channelWrapper.assertQueue(queue);
    return this.channelWrapper.sendToQueue(queue, Buffer.from(message));
  }

  async publishInExchange(
    exchange: string,
    routingKey: string,
    message: string,
  ): Promise<boolean> {
    return this.channelWrapper.publish(
      exchange,
      routingKey,
      Buffer.from(message),
    );
  }

  async consume(queue: string, callback: (message: Message) => void) {
    return this.channelWrapper.consume(queue, (message) => {
      callback(message);
      this.channelWrapper.ack(message);
    });
  }
}
