import { Test, TestingModule } from '@nestjs/testing';
import { RodsController } from './rods.controller';

describe('FishController', () => {
  let controller: RodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RodsController],
    }).compile();

    controller = module.get<RodsController>(RodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
