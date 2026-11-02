import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { FishService } from './fish/fish.service';
import { RodsService } from './rods/rods.service';
import { LocationsService } from './locations/locations.service';
import { BaitsService } from './baits/baits.service';
import { FishermenService } from './fishermen/fishermen.service';

@Controller('bestiary')
export class BestiatyController {
  constructor(
    private fishService: FishService,
    private rodsService: RodsService,
    private locationsService: LocationsService,
    private baitsService: BaitsService,
    private fishermenService: FishermenService,
  ) {}

  @Get('baits/:id')
  getBait(@Param('id', ParseUUIDPipe) id: string) {
    return this.baitsService.findOneById(id);
  }

  @Get('fish/:id')
  getFish(@Param('id', ParseUUIDPipe) id: string) {
    return this.fishService.findOneById(id, { forResponse: true });
  }

  @Get('fishermen/:id')
  getFisherman(@Param('id', ParseUUIDPipe) id: string) {
    return this.fishermenService.findOneById(id);
  }

  @Get('locations/:id')
  getLocation(@Param('id', ParseUUIDPipe) id: string) {
    return this.locationsService.findOneById(id);
  }

  @Get('rods/:id')
  getRod(@Param('id', ParseUUIDPipe) id: string) {
    return this.rodsService.findOneById(id);
  }
}
