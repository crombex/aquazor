import { Module } from '@nestjs/common';
import { FishermenService } from './fishermen.service';
import { FishermenRepository } from './fishermen.repository';

@Module({
  providers: [FishermenService, FishermenRepository],
  exports: [FishermenService]
})
export class FishermenModule {}
