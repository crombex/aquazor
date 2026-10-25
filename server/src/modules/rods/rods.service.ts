import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { RodsRepository } from './rods.repository';
import { mapKeysToCamelCase } from '../../common/utils/change-case';
import { RodEntity, TRodFewData } from './rods.types';

@Injectable()
export class RodsService {
  constructor(private rodsRepository: RodsRepository) {}

  async getRodInfo(
    id: string,
    options: { isFull?: boolean },
  ): Promise<TRodFewData | RodEntity> {
    const foundRod = await this.rodsRepository.findOneById(id);
    if (!foundRod) {
      throw new NotFoundException('Rod with this id does not exist');
    }
    if (!foundRod.deprecated) {
      const mappedRod = mapKeysToCamelCase<RodEntity>(foundRod);
      if (options.isFull) {
        return mappedRod;
      } else {
        const fishWithFewerData: TRodFewData = {
          id: mappedRod.id,
          type: mappedRod.type,
          imageUrl: mappedRod.imageUrl,
          rarity: mappedRod.rarity,
          description: mappedRod.description,
        };
        return fishWithFewerData;
      }
    } else {
      throw new GoneException('This type of fish is deprecated');
    }
  }
}
