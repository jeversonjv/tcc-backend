import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  connect,
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';

@Injectable()
export class RabbitMQServer implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(RabbitMQServer.name);

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

  async publishInQueue(queue: string, message: string) {
    this.logger.log(`Publishing in queue: ${queue} - ${message}`);

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
}
