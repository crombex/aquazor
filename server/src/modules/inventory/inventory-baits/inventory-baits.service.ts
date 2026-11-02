import { Injectable } from '@nestjs/common';
import {
  IGetUserInventoryOptions,
  IGetUserInventoryOptionsTransaction,
} from '../common/inventory.types';
import { InventoryFishRepository } from './inventory-baits.repository';
import { InventoryFishEntity } from './inventory-baits.types';
import { mapKeysToCamelCase } from '../../../common/utils/change-case';

@Injectable()
export class InventoryFishService {
  constructor(private inventoryFishRepository: InventoryFishRepository) {}

  async getInventoryFish(
    params: IGetUserInventoryOptions,
  ): Promise<InventoryFishEntity[]>;
  async getInventoryFish(
    params: IGetUserInventoryOptionsTransaction,
  ): Promise<void>;

  async getInventoryFish(
    params: IGetUserInventoryOptions | IGetUserInventoryOptionsTransaction,
  ): Promise<any> {
    if (params.limit && (params.limit < 0 || params.limit > 100)) {
      params.limit = 100;
    }
    if (params.offset && params.offset < 0) {
      params.offset = 0;
    }
    if ('connection' in params) {
      await this.inventoryFishRepository.getInventoryFish(params);
    } else {
      const fishArray =
        await this.inventoryFishRepository.getInventoryFish(params);
      fishArray.forEach((fish) => {
        mapKeysToCamelCase<InventoryFishEntity>(fish);
      });
      return fishArray as unknown as InventoryFishEntity[];
    }
  }
}
