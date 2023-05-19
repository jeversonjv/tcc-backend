import { Test, TestingModule } from '@nestjs/testing';
import { NQueenService } from './n-queen.service';

describe('NQueenService', () => {
  let service: NQueenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NQueenService],
    }).compile();

    service = module.get<NQueenService>(NQueenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
