import { Module } from '@nestjs/common';
import { InventoryBaitsRepository } from '../inventory-baits/inventory-baits.repository';
import { InventoryBaitsService } from '../inventory-baits/inventory-baits.service';

@Module({
  providers: [InventoryBaitsService, InventoryBaitsRepository],
  exports: [InventoryBaitsService],
})
export class InventoryBaitsModule {}
