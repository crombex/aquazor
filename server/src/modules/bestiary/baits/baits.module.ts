import { Module } from '@nestjs/common';
import { BaitsService } from './baits.service';
import { BaitsRepository } from './baits.repository';

@Module({
  providers: [BaitsService, BaitsRepository],
  exports: [BaitsService]
})
export class BaitsModule {}
