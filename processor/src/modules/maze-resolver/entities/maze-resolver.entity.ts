import { Processing } from 'src/shared/entities/processing.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class MazeResolver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'input',
    type: 'json',
  })
  input: Array<Array<number>>;

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
