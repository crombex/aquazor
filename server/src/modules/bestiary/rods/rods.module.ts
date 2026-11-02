import { Module } from '@nestjs/common';
import { RodsService } from './rods.service';
import { RodsRepository } from './rods.repository';

@Module({
  providers: [RodsService, RodsRepository],
  exports: [RodsService]
})
export class RodsModule {}
