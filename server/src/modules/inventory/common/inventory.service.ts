import { Injectable } from '@nestjs/common';
import {
  EInventoryCategories,
  IGetUserInventoryOptions,
} from './inventory.types';
import { InventoryFishService } from '../inventory-fish/inventory-fish.service';
import { InventoryBaitsService } from '../inventory-baits/inventory-baits.service';
import { InventoryRodsService } from '../inventory-rods/inventory-rods.service';
import { InventoryFishermenService } from '../inventory-fishermen/inventory-fishermen.service';

@Injectable()
export class InventoryService {
  constructor(
    private inventoryFishService: InventoryFishService,
    private inventoryRodsService: InventoryRodsService,
    private inventoryFishermenService: InventoryFishermenService,
    private inventoryBaitsService: InventoryBaitsService,
  ) {}

  async getUserInventory({ category, userId }: IGetUserInventoryOptions) {
    switch (category) {
      case EInventoryCategories.FISH:
        await this.inventoryFishService.getAllUserFish(userId);
        break;
      case EInventoryCategories.BAITS:
        await this.inventoryBaitsService.getAllUserBaits(userId);
        break;
      case EInventoryCategories.FISHERMEN:
        await this.inventoryFishermenService.getAllUserFishermen(userId);
        break;
      case EInventoryCategories.RODS:
        await this.inventoryRodsService.getAllUserRods(userId);
        break;
    }
  }
}
