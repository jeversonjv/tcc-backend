import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MazeResolver } from './entities/maze-resolver.entity';
import { MazeResolverService } from './maze-resolver.service';
import { MazeResolverController } from './maze-resolver.controller';
import { MazeResolverAlgorithmProvider } from './providers/maze-resolver-algorithm.provider';
import { RabbitMQServer } from '../../shared/infra/rabbitmq-server';
import { Processing } from 'src/shared/entities/processing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MazeResolver, Processing])],
  controllers: [MazeResolverController],
  providers: [
    {
      provide: 'RABBIT_MQ_SERVER',
      useClass: RabbitMQServer,
    },
    {
      provide: 'MAZE_RESOLVER_PROVIDER',
      useClass: MazeResolverAlgorithmProvider,
    },
    MazeResolverService,
  ],
})
export class MazeResolverModule {}
