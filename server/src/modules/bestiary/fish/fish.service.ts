import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { FishRepository } from './fish.repository';
import { mapKeysToCamelCase } from '../../../common/utils/change-case';
import { FishEntity, TFishForResponseData } from './fish.types';
import { EGameRarity } from '../../game/game.types';

@Injectable()
export class FishService {
  constructor(private fishRepository: FishRepository) {}

  async findOneById(
    id: string,
    options?: { forResponse: boolean },
  ): Promise<TFishForResponseData | FishEntity> {
    const foundFish = await this.fishRepository.findOneById(id);
    if (!foundFish) {
      throw new NotFoundException('Fish with this id does not exist');
    }
    const mappedFish = mapKeysToCamelCase<FishEntity>(foundFish);
    if (!options || options.forResponse === false) {
      return mappedFish;
    } else {
      const fishWithFewerData: TFishForResponseData = {
        id: mappedFish.id,
        type: mappedFish.type,
        imageUrl: mappedFish.imageUrl,
        rarity: mappedFish.rarity,
        description: mappedFish.description,
        maxLength: mappedFish.maxLength,
        minLength: mappedFish.minLength,
        maxWeight: mappedFish.maxWeight,
        minWeight: mappedFish.minLength,
        minSellPrice: mappedFish.minSellPrice,
        unavailable: mappedFish.unavailable,
      };
      return fishWithFewerData;
    }
  }

  async getOneInCategory(category: EGameRarity) {
    return await this.fishRepository.getOneInCategory(category)
  }
}
