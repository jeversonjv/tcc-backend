import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sudoku } from './entities/sudoku.entity';
import { SudokuService } from './sudoku.service';
import { SudokuAlgorithmProvider } from './providers/sudoku-algorithm.provider';
import { Processing } from 'src/shared/entities/processing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sudoku, Processing])],
  providers: [
    {
      provide: 'SUDOKU_PROVIDER',
      useClass: SudokuAlgorithmProvider,
    },
    SudokuService,
  ],
})
export class SudokuModule {}
