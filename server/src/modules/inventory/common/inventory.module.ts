import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryFishModule } from '../inventory-fish/inventory-fish.module';
import { InventoryBaitsModule } from '../inventory-baits/inventory-baits.module';
import { InventoryRodsModule } from '../inventory-rods/inventory-rods.module';
import { InventoryFishermenModule } from '../inventory-fishermen/inventory-fishermen.module';

@Module({
  imports: [
    InventoryFishModule,
    InventoryBaitsModule,
    InventoryRodsModule,
    InventoryFishermenModule,
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
