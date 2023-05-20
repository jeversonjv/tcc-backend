import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProcessStatus } from '../enums/process-status.enum';
import { Sudoku } from 'src/modules/sudoku/entities/sudoku.entity';
import { NQueen } from 'src/modules/n-queen/entities/n-queen.entity';
import { MazeResolver } from 'src/modules/maze-resolver/entities/maze-resolver.entity';

@Entity()
export class Processing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ProcessStatus,
    default: ProcessStatus.PENDING,
  })
  status: ProcessStatus;

  @Column({
    name: 'total_time_to_process',
    type: 'float',
    nullable: true,
  })
  totalTimeToProcess: number;

  @Column({
    type: 'json',
    nullable: true,
  })
  result: JSON;

  @Column({
    name: 'finished_at',
    type: 'timestamp with time zone',
  })
  finishedAt: Date;

  @OneToOne(() => Sudoku, (sudoku) => sudoku.processing)
  sudoku: Sudoku;

  @OneToOne(() => NQueen, (nQueen) => nQueen.processing)
  nQueen: NQueen;

  @OneToOne(() => MazeResolver, (mazeResolver) => mazeResolver.processing)
  mazeResolver: MazeResolver;
}
