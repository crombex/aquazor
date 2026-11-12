import { Injectable, NotFoundException } from '@nestjs/common';
import { LocationsRepository } from './locations.repository';
import { mapKeysToCamelCase } from '../../../common/utils/change-case';
import { LocationEntity, TAddLocationForUser} from './locations.types';

@Injectable()
export class LocationsService {
  constructor(private locationsRepository: LocationsRepository) {}

  async findOneById(id: string): Promise<LocationEntity> {
    const foundLocation = await this.locationsRepository.findOneById(id);
    if (!foundLocation) {
      throw new NotFoundException('Location with this id does not exist');
    }
    const mappedLocation = mapKeysToCamelCase<LocationEntity>(foundLocation);
    return mappedLocation;
  }

  async addForUser(params: TAddLocationForUser) {
    await this.locationsRepository.addForUser(params)
  }

  async hasUserLocation(userId: string, locationId: string) {
    return await this.locationsRepository.hasUserLocation(userId, locationId)
  }
}
