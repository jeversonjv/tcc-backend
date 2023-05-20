import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import { SudokuService } from './sudoku.service';

@Controller('api/v1/sudoku')
export class SudokuController {
  constructor(private readonly sudokuService: SudokuService) {}

  @Get()
  async findAll() {
    return this.sudokuService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const sudoku = await this.sudokuService.findOne(id);

    if (!sudoku) {
      throw new BadRequestException(`Sudoku with id ${id} not found`);
    }

    return sudoku;
  }

  @Post()
  async sendToProcess(@Body() input: JSON) {
    return this.sudokuService.sendToProcess(input);
  }
}
