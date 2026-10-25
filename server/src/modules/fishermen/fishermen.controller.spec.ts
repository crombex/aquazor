import { Test, TestingModule } from '@nestjs/testing';
import { FishermenController } from './fishermen.controller';

describe('FishController', () => {
  let controller: FishermenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FishermenController],
    }).compile();

    controller = module.get<FishermenController>(FishermenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
