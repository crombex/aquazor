import { Module } from '@nestjs/common';
import { InventoryFishRepository } from '../inventory-fish/inventory-fish.repository';
import { InventoryFishService } from '../inventory-fish/inventory-fish.service';

@Module({
  providers: [InventoryFishService, InventoryFishRepository],
  exports: [InventoryFishService],
})
export class InventoryFishModule {}
