import { Test, TestingModule } from '@nestjs/testing';
import { RodsService } from './rods.service';

describe('FishService', () => {
  let service: RodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RodsService],
    }).compile();

    service = module.get<RodsService>(RodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
