import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'amqplib';
import { MazeResolver } from './entities/maze-resolver.entity';
import { MazeResolverAlgorithmProvider } from './providers/maze-resolver-algorithm.provider';
import { ProcessStatus } from '../../shared/enums/process-status.enum';
import { RabbitMQServer } from '../../shared/infra/rabbitmq-server';
import { Processing } from 'src/shared/entities/processing.entity';

@Injectable()
export class MazeResolverService {
  constructor(
    @InjectRepository(MazeResolver)
    private mazeResolverRepository: Repository<MazeResolver>,

    @InjectRepository(Processing)
    private processingRepository: Repository<Processing>,

    @Inject('RABBIT_MQ_SERVER')
    private rabbitMQServer: RabbitMQServer,

    @Inject('MAZE_RESOLVER_PROVIDER')
    private mazeResolverAlgorithmProvider: MazeResolverAlgorithmProvider,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitMQServer.addSetup('maze-resolver-process', this);
  }

  async findAll() {
    const mazeResolvers = await this.mazeResolverRepository.find({
      relations: ['processing'],
    });

    return mazeResolvers.map((mazeResolver) => ({
      ...mazeResolver,
      input: mazeResolver.input.length,
    }));
  }

  async findOne(id: string) {
    const mazeResolver = await this.mazeResolverRepository.findOne({
      where: { id },
      relations: ['processing'],
    });

    return mazeResolver;
  }

  async sendToProcess(input: JSON) {
    const processing = await this.processingRepository.save({
      status: ProcessStatus.PENDING,
    });

    const newMazeResolver = this.mazeResolverRepository.create({
      input: input['maze'],
      processing,
    });

    const { id } = await this.mazeResolverRepository.save(newMazeResolver);

    await this.rabbitMQServer.publishInQueue(
      'maze-resolver-process',
      JSON.stringify({ id }),
    );

    return { id };
  }

  async process(message: Message) {
    const { id } = JSON.parse(message.content.toString());

    const mazeResolver = await this.mazeResolverRepository.findOne({
      where: { id },
    });
    if (!mazeResolver) return;

    const { result, totalTimeToProcess } =
      this.mazeResolverAlgorithmProvider.handle(mazeResolver.input);

    const updateData = {
      processing: {
        status: ProcessStatus.COMPLETED,
        totalTimeToProcess,
        result,
      },
    };

    await this.mazeResolverRepository.save({ id, ...updateData });
  }
}
