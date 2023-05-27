import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sudoku } from './entities/sudoku.entity';
import { ProcessStatus } from '../../shared/enums/process-status.enum';
import { RabbitMQServer } from '../../shared/infra/rabbitmq-server';

@Injectable()
export class SudokuService {
  constructor(
    @InjectRepository(Sudoku)
    private sudokuRepository: Repository<Sudoku>,

    @Inject('RABBIT_MQ_SERVER')
    private rabbitMQServer: RabbitMQServer,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitMQServer.addSetup('sudoku-process', this);
  }

  async findAll() {
    const sudokus = await this.sudokuRepository.find({
      relations: ['processing'],
    });
    return sudokus.map((sudoku) => ({
      id: sudoku.id,
      processing: {
        status: sudoku.processing.status,
        totalTimeProcess: sudoku.processing.totalTimeToProcess,
      },
    }));
  }

  async findOne(id: string) {
    const sudoku = await this.sudokuRepository.findOne({
      where: { id },
      relations: ['processing'],
    });
    return sudoku;
  }

  async sendToProcess(input: JSON) {
    const newSudoku = this.sudokuRepository.create({
      input: input['sudoku'],
      processing: {
        status: ProcessStatus.PENDING,
      },
    });

    const { id } = await this.sudokuRepository.save(newSudoku);

    await this.rabbitMQServer.publishInQueue(
      'sudoku-process',
      JSON.stringify({ id }),
    );

    return { id };
  }
}
