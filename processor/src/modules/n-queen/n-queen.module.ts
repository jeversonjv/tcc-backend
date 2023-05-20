import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NQueen } from './entities/n-queen.entity';
import { NQueenService } from './n-queen.service';
import { NQueensAlgorithmProvider } from './providers/n-queen-algorithm.provider';
import { Processing } from 'src/shared/entities/processing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NQueen, Processing])],
  providers: [
    {
      provide: 'NQUEEN_PROVIDER',
      useClass: NQueensAlgorithmProvider,
    },
    NQueenService,
  ],
})
export class NQueenModule {}
