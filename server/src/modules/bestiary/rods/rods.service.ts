import { Injectable, NotFoundException } from '@nestjs/common';
import { RodsRepository } from './rods.repository';
import { mapKeysToCamelCase } from '../../../common/utils/change-case';
import { RodEntity } from './rods.types';

@Injectable()
export class RodsService {
  constructor(private rodsRepository: RodsRepository) {}

  async findOneById(id: string): Promise<RodEntity> {
    const foundRod = await this.rodsRepository.findOneById(id);
    if (!foundRod) {
      throw new NotFoundException('Rod with this id does not exist');
    }
    const mappedRod = mapKeysToCamelCase<RodEntity>(foundRod);
    return mappedRod;
  }
}
