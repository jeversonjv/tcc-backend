import { Processing } from 'src/shared/entities/processing.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Sudoku {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'input',
    type: 'json',
  })
  input: JSON;

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
