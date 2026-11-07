import { Module } from '@nestjs/common';
import { InventoryRodsRepository } from './inventory-rods.repository';
import { InventoryRodsService } from './inventory-rods.service';

@Module({
  providers: [InventoryRodsService, InventoryRodsRepository],
  exports: [InventoryRodsService],
})
export class InventoryRodsModule {}
