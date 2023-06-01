import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'amqplib';
import { MazeResolver } from './entities/maze-resolver.entity';
import { MazeResolverAlgorithmProvider } from './providers/maze-resolver-algorithm.provider';
import { ProcessStatus } from '../../shared/enums/process-status.enum';
import { RabbitMQServer } from '../../shared/infra/rabbitmq-server';

@Injectable()
export class MazeResolverService {
  constructor(
    @InjectRepository(MazeResolver)
    private mazeResolverRepository: Repository<MazeResolver>,

    @Inject('RABBIT_MQ_SERVER')
    private rabbitMQServer: RabbitMQServer,

    @Inject('MAZE_RESOLVER_PROVIDER')
    private mazeResolverAlgorithmProvider: MazeResolverAlgorithmProvider,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitMQServer.addSetup('maze-resolver-process', this);
  }

  async process(message: Message) {
    const { id } = JSON.parse(message.content.toString());

    const mazeResolver = await this.mazeResolverRepository.findOne({
      where: { id },
      relations: ['processing'],
    });

    if (!mazeResolver) return;

    const { result, totalTimeToProcess } =
      this.mazeResolverAlgorithmProvider.handle(mazeResolver.input);

    mazeResolver.processing = {
      ...mazeResolver.processing,
      status: ProcessStatus.COMPLETED,
      totalTimeToProcess,
      result,
      finishedAt: new Date(),
    };

    await this.mazeResolverRepository.save(mazeResolver);
  }
}
