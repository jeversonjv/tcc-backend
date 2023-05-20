import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Processing } from 'src/shared/entities/processing.entity';

@Entity()
export class NQueen {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'number_of_queens',
    type: 'int',
  })
  numberOfQueens: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @OneToOne(() => Processing, (processing) => processing.sudoku, {
    cascade: true,
  })
  @JoinColumn()
  processing: Processing;
}
