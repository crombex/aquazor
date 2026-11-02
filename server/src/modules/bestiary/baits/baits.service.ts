import { Injectable, NotFoundException } from '@nestjs/common';
import { BaitsRepository } from './baits.repository';
import { mapKeysToCamelCase } from '../../../common/utils/change-case';
import { BaitEntity } from './baits.types';

@Injectable()
export class BaitsService {
  constructor(private baitsRepository: BaitsRepository) {}

  async findOneById(id: string): Promise<BaitEntity> {
    const foundBait = await this.baitsRepository.findOneById(id);
    if (!foundBait) {
      throw new NotFoundException('Bait with this id does not exist');
    }
    const mappedBait = mapKeysToCamelCase<BaitEntity>(foundBait);
    return mappedBait;
  }
}
