import { Module } from '@nestjs/common';
import { FishService } from './fish.service';
import { FishRepository } from './fish.repository';

@Module({
  providers: [FishService, FishRepository],
  exports: [FishService]
})
export class FishModule {}
