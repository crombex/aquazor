import { Module } from "@nestjs/common";
import { InventoryFishRepository } from "./inventory-fish.repository";
import { InventoryFishService } from "./inventory-fish.service";

@Module({
  providers: [InventoryFishService, InventoryFishRepository],
  exports: [InventoryFishService]
})
export class InventoryFishModule {}