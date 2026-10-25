import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { LocationsRepository } from './locations.repository';

@Module({
  providers: [LocationsService, LocationsRepository],
  controllers: [LocationsController],
})
export class LocationsModule {}
