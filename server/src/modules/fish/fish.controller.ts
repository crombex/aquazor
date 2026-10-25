import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { FishService } from './fish.service';

@Controller('fish')
export class FishController {
  constructor(private fishService: FishService) {}

  @Get(':id')
  getFishInfo(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('isFull', new ParseBoolPipe({ optional: true })) isFull?: boolean,
  ) {
    return this.fishService.getFishInfo(id, { isFull });
  }
}
