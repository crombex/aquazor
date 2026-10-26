import { Test, TestingModule } from '@nestjs/testing';
import { BaitsController } from './baits.controller';

describe('FishController', () => {
  let controller: BaitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaitsController],
    }).compile();

    controller = module.get<BaitsController>(BaitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
