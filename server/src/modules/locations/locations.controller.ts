import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Get(':id')
  getlocationInfo(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('isFull', new ParseBoolPipe({ optional: true })) isFull?: boolean,
  ) {
    return this.locationsService.getLocationInfo(id, { isFull });
  }
}
