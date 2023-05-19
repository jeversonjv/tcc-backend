import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { MazeResolverService } from './maze-resolver.service';

@Controller('api/v1/maze-resolver')
export class MazeResolverController {
  constructor(private readonly mazeResolverService: MazeResolverService) {}

  @Get()
  async findAll() {
    return this.mazeResolverService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const mazeResolver = await this.mazeResolverService.findOne(id);

    if (!mazeResolver) {
      throw new BadRequestException(`Maze Resolver with id ${id} not found`);
    }

    return mazeResolver;
  }

  @Post()
  async sendToProcess(@Body() input: JSON) {
    return this.mazeResolverService.sendToProcess(input);
  }
}
