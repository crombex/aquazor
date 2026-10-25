import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { LocationsRepository } from './locations.repository';
import { mapKeysToCamelCase } from '../../common/utils/change-case';
import { LocationEntity, TLocationFewData } from './locations.types';

@Injectable()
export class LocationsService {
  constructor(private locationsRepository: LocationsRepository) {}

  async getLocationInfo(
    id: string,
    options: { isFull?: boolean },
  ): Promise<TLocationFewData | LocationEntity> {
    const foundLocation = await this.locationsRepository.findOneById(id);
    if (!foundLocation) {
      throw new NotFoundException('Location with this id does not exist');
    }
    if (!foundLocation.deprecated) {
      const mappedLocation = mapKeysToCamelCase<LocationEntity>(foundLocation);
      if (options.isFull) {
        return mappedLocation;
      } else {
        const locationWithFewerData: TLocationFewData = {
          id: mappedLocation.id,
          type: mappedLocation.type,
          imageUrl: mappedLocation.imageUrl,
          title: mappedLocation.title,
          description: mappedLocation.description,
        };
        return locationWithFewerData;
      }
    } else {
      throw new GoneException('This location is deprecated');
    }
  }
}
