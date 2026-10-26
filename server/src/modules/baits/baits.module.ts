import { Module } from '@nestjs/common';
import { BaitsService } from './baits.service';
import { BaitsController } from './baits.controller';
import { BaitsRepository } from './baits.repository';

@Module({
  providers: [BaitsService, BaitsRepository],
  controllers: [BaitsController],
})
export class BaitsModule {}
