import { Test, TestingModule } from '@nestjs/testing';
import { MazeResolverService } from './maze-resolver.service';

describe('MazeResolverService', () => {
  let service: MazeResolverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MazeResolverService],
    }).compile();

    service = module.get<MazeResolverService>(MazeResolverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
