import { Injectable } from '@nestjs/common';
import {
  IGetUserInventoryOptions
} from '../common/inventory.types';
import { InventoryFishRepository } from './inventory-fish.repository';
import { InventoryFishEntity, TAddInventoryFish } from './inventory-fish.types';
import { mapKeysToCamelCase } from '../../../common/utils/change-case';
import { TInventoryFishInDatabase } from '../inventory-baits/inventory-baits.types';

@Injectable()
export class InventoryFishService {
  constructor(private inventoryFishRepository: InventoryFishRepository) {}

  async getAllInventoryFish(
    params: IGetUserInventoryOptions,
  ): Promise<InventoryFishEntity[] | void> {
    if (params.limit && (params.limit < 0 || params.limit > 100)) {
      params.limit = 100;
    }
    if (params.offset && params.offset < 0) {
      params.offset = 0;
    }
    if (params.connection) {
      await this.inventoryFishRepository.getAllFish(params);
    } else {
      const fishArray =
        await this.inventoryFishRepository.getAllFish(params) as TInventoryFishInDatabase[];
      const mappedFishArray: InventoryFishEntity[] = [];
      fishArray.forEach((fish) => {
        mappedFishArray.push(mapKeysToCamelCase<InventoryFishEntity>(fish));
      });
      return mappedFishArray;
    }
  }

  async addFish(params: TAddInventoryFish) {
    if (params.connection) {
      await this.inventoryFishRepository.addFish(params);
    } else {
      const fishId = await this.inventoryFishRepository.addFish(params) as string
      return
    }
  }
}
