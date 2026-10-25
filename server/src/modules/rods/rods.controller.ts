import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { RodsService } from './rods.service';

@Controller('rods')
export class RodsController {
  constructor(private rodsService: RodsService) {}

  @Get(':id')
  getRodInfo(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('isFull', new ParseBoolPipe({ optional: true })) isFull?: boolean,
  ) {
    return this.rodsService.getRodInfo(id, { isFull });
  }
}
