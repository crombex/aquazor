import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { RodsService } from './rods.service';

@Controller('rods')
export class RodsController {
  constructor(private rodsService: RodsService) {}

  @Get(':id')
  getRodInfo(@Param('id', ParseUUIDPipe) id: string) {
    return this.rodsService.findOneById(id);
  }
}
