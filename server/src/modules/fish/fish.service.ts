import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { FishRepository } from './fish.repository';
import { mapKeysToCamelCase } from '../../common/utils/change-case';
import { FishEntity, TFishFewData } from './fish.types';

@Injectable()
export class FishService {
  constructor(private fishRepository: FishRepository) {}

  async getFishInfo(id: string, options: {isFull?: boolean}): Promise<TFishFewData | FishEntity> {
    const foundFish = await this.fishRepository.findOneById(id)
    if (!foundFish) {
      throw new NotFoundException('Fish with this id does not exist')
    }
    if (!foundFish.deprecated) {
      const mappedFish = mapKeysToCamelCase<FishEntity>(foundFish)
      if (options.isFull) {
        return mappedFish
      } else {
        const fishWithFewerData: TFishFewData = {
          id: mappedFish.id,
          type: mappedFish.type,
          imageUrl: mappedFish.imageUrl,
          rarity: mappedFish.rarity,
          description: mappedFish.description
        }
        return fishWithFewerData
      }
    } else {
      throw new GoneException('This type of fish is deprecated')
    }
  }
}
