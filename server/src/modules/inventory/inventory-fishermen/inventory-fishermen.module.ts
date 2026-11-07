import { Module } from '@nestjs/common';
import { InventoryFishermenRepository } from './inventory-fishermen.repository';
import { InventoryFishermenService } from './inventory-fishermen.service';

@Module({
  providers: [InventoryFishermenService, InventoryFishermenRepository],
  exports: [InventoryFishermenService],
})
export class InventoryFishermenModule {}
