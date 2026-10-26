import { Test, TestingModule } from '@nestjs/testing';
import { BaitsService } from './baits.service';

describe('FishService', () => {
  let service: BaitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaitsService],
    }).compile();

    service = module.get<BaitsService>(BaitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
