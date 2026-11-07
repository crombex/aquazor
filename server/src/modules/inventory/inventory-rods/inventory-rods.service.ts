import { Injectable } from '@nestjs/common';
import { InventoryRodsRepository } from './inventory-rods.repository';
import { mapKeysToCamelCase } from '../../../common/utils/change-case';
import { InventoryRodEntity, TAddInventoryRod } from './inventory-rods.types';
import { TAddInventoryItem } from '../common/inventory.types';

@Injectable()
export class InventoryRodsService {
  constructor(private inventoryRodsRepository: InventoryRodsRepository) {}

  async getAllUserRods(userId: string): Promise<InventoryRodEntity[]> {
    const rodsArray =
      await this.inventoryRodsRepository.getAllUserRods(userId);
    const mappedRodsArray: InventoryRodEntity[] = [];
    rodsArray.forEach((rod) => {
      mappedRodsArray.push(mapKeysToCamelCase<InventoryRodEntity>(rod));
    });
    return mappedRodsArray;
  }

  // async addRod(params: TAddInventoryItem<TAddInventoryRod>) {
  //   await this.inventoryRodsRepository.addRod(params);
  // }
}
