import { Injectable } from '@nestjs/common';
import { InventoryBaitsRepository } from './inventory-baits.repository';
import { mapKeysToCamelCase } from '../../../common/utils/change-case';
import { InventoryBaitEntity, TAddInventoryBait } from './inventory-baits.types';
import { TAddInventoryItem } from '../common/inventory.types';

@Injectable()
export class InventoryBaitsService {
  constructor(private inventoryBaitsRepository: InventoryBaitsRepository) {}

  async getAllUserBaits(userId: string): Promise<InventoryBaitEntity[]> {
    const baitsArray = await this.inventoryBaitsRepository.getAllUserBaits(userId);
    const mappedBaitsArray: InventoryBaitEntity[] = [];
    baitsArray.forEach((bait) => {
      mappedBaitsArray.push(mapKeysToCamelCase<InventoryBaitEntity>(bait));
    });
    return mappedBaitsArray;
  }

  // async addFish(params: TAddInventoryItem<TAddInventoryBait>) {
  //   await this.inventoryBaitsRepository.addBait(params);
  // }
}
