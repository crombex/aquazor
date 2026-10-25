import { Module } from '@nestjs/common';
import { FishService } from './fish.service';
import { FishController } from './fish.controller';
import { FishRepository } from './fish.repository';

@Module({
  providers: [FishService, FishRepository],
  controllers: [FishController],
})
export class FishModule {}
