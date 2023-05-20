import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MazeResolver } from './entities/maze-resolver.entity';
import { ProcessStatus } from '../../shared/enums/process-status.enum';
import { RabbitMQServer } from '../../shared/infra/rabbitmq-server';

@Injectable()
export class MazeResolverService {
  constructor(
    @InjectRepository(MazeResolver)
    private mazeResolverRepository: Repository<MazeResolver>,

    @Inject('RABBIT_MQ_SERVER')
    private rabbitMQServer: RabbitMQServer,
  ) {}

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
    const newMazeResolver = this.mazeResolverRepository.create({
      input: input['maze'],
      processing: {
        status: ProcessStatus.PENDING,
      },
    });

    const { id } = await this.mazeResolverRepository.save(newMazeResolver);

    await this.rabbitMQServer.publishInQueue(
      'maze-resolver-process',
      JSON.stringify({ id }),
    );

    return { id };
  }
}
