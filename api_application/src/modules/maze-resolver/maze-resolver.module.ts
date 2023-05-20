import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MazeResolver } from './entities/maze-resolver.entity';
import { MazeResolverService } from './maze-resolver.service';
import { MazeResolverController } from './maze-resolver.controller';
import { Processing } from 'src/shared/entities/processing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MazeResolver, Processing])],
  controllers: [MazeResolverController],
  providers: [MazeResolverService],
})
export class MazeResolverModule {}
