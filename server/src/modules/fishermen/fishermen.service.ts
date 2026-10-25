import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { FishermenRepository } from './fishermen.repository';
import { mapKeysToCamelCase } from '../../common/utils/change-case';
import { FishermanEntity, TFishermanFewData } from './fishermen.types';

@Injectable()
export class FishermenService {
  constructor(private fishermenRepository: FishermenRepository) {}

  async getFishermanInfo(
    id: string,
    options: { isFull?: boolean },
  ): Promise<TFishermanFewData | FishermanEntity> {
    const foundFisherman = await this.fishermenRepository.findOneById(id);
    if (!foundFisherman) {
      throw new NotFoundException('Fisherman with this id does not exist');
    }
    if (!foundFisherman.deprecated) {
      const mappedFisherman =
        mapKeysToCamelCase<FishermanEntity>(foundFisherman);
      if (options.isFull) {
        return mappedFisherman;
      } else {
        const fishermanWithFewerData: TFishermanFewData = {
          id: mappedFisherman.id,
          name: mappedFisherman.name,
          avatarUrl: mappedFisherman.avatarUrl,
          age: mappedFisherman.age,
          description: mappedFisherman.description,
        };
        return fishermanWithFewerData;
      }
    } else {
      throw new GoneException('This fisherman is deprecated');
    }
  }
}
