import { Injectable } from '@nestjs/common';
import { InventoryRodsRepository } from './inventory-rods.repository';
import { mapKeysToCamelCase } from '../../../common/utils/change-case';
import { InventoryRodEntity, TAddInventoryRod } from './inventory-rods.types';
import { TAddInventoryItem } from '../common/inventory.types';
import { PoolClient } from 'pg';

@Injectable()
export class InventoryRodsService {
  constructor(private inventoryRodsRepository: InventoryRodsRepository) {}

  async getAllUserRods(userId: string): Promise<InventoryRodEntity[]> {
    const rodsArray = await this.inventoryRodsRepository.getAllUserRods(userId);
    const mappedRodsArray: InventoryRodEntity[] = [];
    rodsArray.forEach((rod) => {
      mappedRodsArray.push(mapKeysToCamelCase<InventoryRodEntity>(rod));
    });
    return mappedRodsArray;
  }

  async addRod(params: TAddInventoryItem<TAddInventoryRod>) {
    await this.inventoryRodsRepository.addRod(params);
  }

  async findOneById(id: string) {
    const foundRod = await this.inventoryRodsRepository.findOneById(id);
    if (!foundRod) {
      return null;
    } else {
      return mapKeysToCamelCase<InventoryRodEntity>(foundRod);
    }
  }

  async markBusy(
    params: { rodId: string; startedAt: string; finishedAt: string },
    connection: PoolClient,
  ) {
    await this.inventoryRodsRepository.markBusy(params, connection);
  }

  async markFree(fishermanId: string, connection: PoolClient) {
    await this.inventoryRodsRepository.markFree(fishermanId, connection);
  }
}
