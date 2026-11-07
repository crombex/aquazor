import { Injectable } from '@nestjs/common';
import { InventoryFishermenRepository } from './inventory-fishermen.repository';
import { mapKeysToCamelCase } from '../../../common/utils/change-case';
import {
  InventoryFishermanEntity,
  TAddInventoryFisherman,
} from './inventory-fishermen.types';
import { TAddInventoryItem } from '../common/inventory.types';

@Injectable()
export class InventoryFishermenService {
  constructor(private inventoryFishermenRepository: InventoryFishermenRepository) {}

  async getAllUserFishermen(userId: string): Promise<InventoryFishermanEntity[]> {
    const fishermenArray = await this.inventoryFishermenRepository.getAllUserFishermen(userId);
    const mappedFishermenArray: InventoryFishermanEntity[] = [];
    fishermenArray.forEach((fisherman) => {
      mappedFishermenArray.push(mapKeysToCamelCase<InventoryFishermanEntity>(fisherman));
    });
    return mappedFishermenArray;
  }

  // async addFisherman(params: TAddInventoryItem<TAddInventoryFisherman>) {
  //   await this.inventoryFishermenRepository.addFisherman(params);
  // }
}
