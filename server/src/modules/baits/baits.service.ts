import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { BaitsRepository } from './baits.repository';
import { mapKeysToCamelCase } from '../../common/utils/change-case';
import { BaitEntity, TBaitFewData } from './baits.types';

@Injectable()
export class BaitsService {
  constructor(private baitsRepository: BaitsRepository) {}

  async getBaitInfo(
    id: string,
    options: { isFull?: boolean },
  ): Promise<TBaitFewData | BaitEntity> {
    const foundBait = await this.baitsRepository.findOneById(id);
    if (!foundBait) {
      throw new NotFoundException('Bait with this id does not exist');
    }
    if (!foundBait.deprecated) {
      const mappedBait =
        mapKeysToCamelCase<BaitEntity>(foundBait);
      if (options.isFull) {
        return mappedBait;
      } else {
        const baitWithFewerData: TBaitFewData = {
          id: mappedBait.id,
          type: mappedBait.type,
          imageUrl: mappedBait.imageUrl,
          rarity: mappedBait.rarity,
          description: mappedBait.description,
        };
        return baitWithFewerData;
      }
    } else {
      throw new GoneException('This bait is deprecated');
    }
  }
}
