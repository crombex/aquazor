import { Injectable, NotFoundException } from '@nestjs/common';
import { FishRepository } from './fish.repository';
import { mapKeysToCamelCase } from '../../../common/utils/change-case';
import { FishEntity } from './fish.types';

@Injectable()
export class FishService {
  constructor(private fishRepository: FishRepository) {}

  async findOneById(id: string): Promise<FishEntity> {
    const foundFish = await this.fishRepository.findOneById(id);
    if (!foundFish) {
      throw new NotFoundException('Fish with this id does not exist');
    }
    const mappedFish = mapKeysToCamelCase<FishEntity>(foundFish);
    return mappedFish;
  }

  async getAll() {
    const fishArray = await this.fishRepository.getAll();
    const normalizedfishArray = fishArray.map((elem) =>
      mapKeysToCamelCase<FishEntity>(elem),
    );
    return normalizedfishArray;
  }
}
