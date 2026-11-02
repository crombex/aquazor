import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Get(':id')
  getLocation(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.locationsService.findOneById(id);
  }
}
