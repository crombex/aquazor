import { Module } from '@nestjs/common';
import { FishermenService } from './fishermen.service';
import { FishermenController } from './fishermen.controller';
import { FishermenRepository } from './fishermen.repository';

@Module({
  providers: [FishermenService, FishermenRepository],
  controllers: [FishermenController],
})
export class FishermenModule {}
