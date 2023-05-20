import { Test, TestingModule } from '@nestjs/testing';
import { NQueenController } from './n-queen.controller';
import { NQueenService } from './n-queen.service';

describe('NQueenController', () => {
  let controller: NQueenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NQueenController],
      providers: [NQueenService],
    }).compile();

    controller = module.get<NQueenController>(NQueenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
