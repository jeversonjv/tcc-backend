import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MazeResolver } from './entities/maze-resolver.entity';
import { MazeResolverService } from './maze-resolver.service';
import { MazeResolverAlgorithmProvider } from './providers/maze-resolver-algorithm.provider';
import { Processing } from 'src/shared/entities/processing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MazeResolver, Processing])],
  providers: [
    {
      provide: 'MAZE_RESOLVER_PROVIDER',
      useClass: MazeResolverAlgorithmProvider,
    },
    MazeResolverService,
  ],
})
export class MazeResolverModule {}
