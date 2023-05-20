import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NQueen } from './entities/n-queen.entity';
import { NQueenService } from './n-queen.service';
import { NQueenController } from './n-queen.controller';
import { Processing } from 'src/shared/entities/processing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NQueen, Processing])],
  controllers: [NQueenController],
  providers: [NQueenService],
})
export class NQueenModule {}
