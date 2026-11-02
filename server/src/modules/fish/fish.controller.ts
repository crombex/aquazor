import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FishService } from './fish.service';

@Controller('fish')
export class FishController {
  constructor(private fishService: FishService) {}

  @Get(':id')
  getFish(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.fishService.findOneById(id, { forResponse: true });
  }
}
