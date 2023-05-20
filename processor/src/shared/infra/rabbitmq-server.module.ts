import { Global, Module } from '@nestjs/common';
import { RabbitMQServer } from './rabbitmq-server';

const providers = [
  {
    provide: 'RABBIT_MQ_SERVER',
    useClass: RabbitMQServer,
  },
];

@Global()
@Module({
  providers,
  exports: providers,
})
export class RabbitMQServerModule {}
