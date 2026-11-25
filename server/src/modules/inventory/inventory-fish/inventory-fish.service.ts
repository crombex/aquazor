import { Injectable } from '@nestjs/common';
import { InventoryFishRepository } from './inventory-fish.repository';
import {
  InventoryFishEntity,
  TAddInventoryFish,
} from '../inventory-fish/inventory-fish.types';
import { mapKeysToCamelCase } from '../../../common/utils/change-case';
import {
  TAddInventoryItem,
  TRemoveInventoryItem,
} from '../common/inventory.types';

@Injectable()
export class InventoryFishService {
  constructor(private inventoryFishRepository: InventoryFishRepository) {}

  async getAllUserFish(userId: string): Promise<InventoryFishEntity[]> {
    const fishArray = await this.inventoryFishRepository.getAllUserFish(userId);
    const mappedFishArray: InventoryFishEntity[] = [];
    fishArray.forEach((fish) => {
      mappedFishArray.push(mapKeysToCamelCase<InventoryFishEntity>(fish));
    });
    return mappedFishArray;
  }

  async addFish(params: TAddInventoryItem<TAddInventoryFish>) {
    await this.inventoryFishRepository.addFish(params);
  }

  async findOneById(id: string) {
    const foundFish = await this.inventoryFishRepository.findOneById(id);
    if (!foundFish) {
      return null;
    } else {
      return mapKeysToCamelCase<InventoryFishEntity>(foundFish);
    }
  }

  async writeOffFish(params: TRemoveInventoryItem) {
    await this.inventoryFishRepository.writeOffFish(params);
  }
}
