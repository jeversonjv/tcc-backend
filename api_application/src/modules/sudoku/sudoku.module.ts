import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sudoku } from './entities/sudoku.entity';
import { SudokuService } from './sudoku.service';
import { SudokuController } from './sudoku.controller';
import { Processing } from 'src/shared/entities/processing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sudoku, Processing])],
  controllers: [SudokuController],
  providers: [SudokuService],
})
export class SudokuModule {}
