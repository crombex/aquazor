import { Injectable, NotFoundException } from '@nestjs/common';
import { FishermenRepository } from './fishermen.repository';
import { mapKeysToCamelCase } from '../../../common/utils/change-case';
import { FishermanEntity } from './fishermen.types';

@Injectable()
export class FishermenService {
  constructor(private fishermenRepository: FishermenRepository) {}

  async findOneById(id: string): Promise<FishermanEntity> {
    const foundFisherman = await this.fishermenRepository.findOneById(id);
    if (!foundFisherman) {
      throw new NotFoundException('Fisherman with this id does not exist');
    }
    const mappedFisherman = mapKeysToCamelCase<FishermanEntity>(foundFisherman);
    return mappedFisherman;
  }
}
