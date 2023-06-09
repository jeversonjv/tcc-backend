import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NQueen } from './entities/n-queen.entity';
import { ProcessStatus } from '../../shared/enums/process-status.enum';
import { RabbitMQServer } from '../../shared/infra/rabbitmq-server';

@Injectable()
export class NQueenService {
  constructor(
    @InjectRepository(NQueen)
    private nQueensRepository: Repository<NQueen>,

    @Inject('RABBIT_MQ_SERVER')
    private rabbitMQServer: RabbitMQServer,
  ) {}

  async findAll() {
    const nQueens = await this.nQueensRepository.find({
      relations: ['processing'],
    });
    return nQueens.map((nQueen) => ({
      id: nQueen.id,
      numberOfQueens: nQueen.numberOfQueens,
      processing: {
        status: nQueen.processing.status,
        totalTimeProcess: nQueen.processing.totalTimeToProcess,
      },
    }));
  }

  async findOne(id: string) {
    const nQueen = await this.nQueensRepository.findOne({
      where: { id },
      relations: ['processing'],
    });
    return nQueen;
  }

  async sendToProcess(numberOfQueens: number) {
    const newNQueen = this.nQueensRepository.create({
      numberOfQueens,
      processing: {
        status: ProcessStatus.PENDING,
      },
    });

    const { id } = await this.nQueensRepository.save(newNQueen);

    await this.rabbitMQServer.publishInQueue(
      'n-queen-process',
      JSON.stringify({ id }),
    );

    return { id };
  }
}
