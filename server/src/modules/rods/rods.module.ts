import { Module } from '@nestjs/common';
import { RodsService } from './rods.service';
import { RodsController } from './rods.controller';
import { RodsRepository } from './rods.repository';

@Module({
  providers: [RodsService, RodsRepository],
  controllers: [RodsController],
})
export class RodsModule {}
