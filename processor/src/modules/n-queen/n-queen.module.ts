import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NQueen } from './entities/n-queen.entity';
import { NQueenService } from './n-queen.service';
import { NQueenController } from './n-queen.controller';
import { NQueensAlgorithmProvider } from './providers/n-queen-algorithm.provider';
import { RabbitMQServer } from '../../shared/infra/rabbitmq-server';
import { Processing } from 'src/shared/entities/processing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NQueen, Processing])],
  controllers: [NQueenController],
  providers: [
    {
      provide: 'RABBIT_MQ_SERVER',
      useClass: RabbitMQServer,
    },
    {
      provide: 'NQUEEN_PROVIDER',
      useClass: NQueensAlgorithmProvider,
    },
    NQueenService,
  ],
})
export class NQueenModule {}
