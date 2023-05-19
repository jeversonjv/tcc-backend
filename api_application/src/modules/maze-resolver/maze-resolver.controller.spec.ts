import { Test, TestingModule } from '@nestjs/testing';
import { MazeResolverController } from './maze-resolver.controller';
import { MazeResolverService } from './maze-resolver.service';

describe('MazeResolverController', () => {
  let controller: MazeResolverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MazeResolverController],
      providers: [MazeResolverService],
    }).compile();

    controller = module.get<MazeResolverController>(MazeResolverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
