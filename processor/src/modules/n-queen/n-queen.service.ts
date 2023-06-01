import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'amqplib';
import { NQueen } from './entities/n-queen.entity';
import { NQueensAlgorithmProvider } from './providers/n-queen-algorithm.provider';
import { ProcessStatus } from '../../shared/enums/process-status.enum';
import { RabbitMQServer } from '../../shared/infra/rabbitmq-server';
import { Processing } from 'src/shared/entities/processing.entity';

@Injectable()
export class NQueenService {
  constructor(
    @InjectRepository(NQueen)
    private nQueensRepository: Repository<NQueen>,

    @Inject('RABBIT_MQ_SERVER')
    private rabbitMQServer: RabbitMQServer,

    @Inject('NQUEEN_PROVIDER')
    private nQueensAlgorithmProvider: NQueensAlgorithmProvider,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitMQServer.addSetup('n-queen-process', this);
  }

  async process(message: Message) {
    const { id } = JSON.parse(message.content.toString());

    const nQueen = await this.nQueensRepository.findOne({
      where: { id },
      relations: ['processing'],
    });
    if (!nQueen) return;

    const { result, totalTimeToProcess } = this.nQueensAlgorithmProvider.handle(
      nQueen.numberOfQueens,
    );

    nQueen.processing = {
      ...nQueen.processing,
      status: ProcessStatus.COMPLETED,
      totalTimeToProcess,
      result,
      finishedAt: new Date(),
    } as Processing;

    await this.nQueensRepository.save(nQueen);
  }
}
