import { Test, TestingModule } from '@nestjs/testing';
import { FishermenService } from './fishermen.service';

describe('FishService', () => {
  let service: FishermenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FishermenService],
    }).compile();

    service = module.get<FishermenService>(FishermenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
