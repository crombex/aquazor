import { Module } from '@nestjs/common';
import { InventoryFishRepository } from './inventory-baits.repository';
import { InventoryFishService } from './inventory-baits.service';

@Module({
  providers: [InventoryFishService, InventoryFishRepository],
  exports: [InventoryFishService],
})
export class InventoryFishModule {}
