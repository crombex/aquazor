import { Module } from '@nestjs/common';
import { RodsModule } from './rods/rods.module';
import { BaitsModule } from './baits/baits.module';
import { LocationsModule } from './locations/locations.module';
import { FishermenModule } from './fishermen/fishermen.module';
import { BestiatyController } from './bestiary.controller';
import { FishModule } from './fish/fish.module';

@Module({
  imports: [
    FishModule,
    RodsModule,
    BaitsModule,
    LocationsModule,
    FishermenModule,
  ],
  controllers: [BestiatyController],
})
export class BestiatyModule {}
