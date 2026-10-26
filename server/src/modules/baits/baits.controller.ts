import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { BaitsService } from './baits.service';

@Controller('baits')
export class BaitsController {
  constructor(private baitsService: BaitsService) {}

  @Get(':id')
  getBaitInfo(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('isFull', new ParseBoolPipe({ optional: true })) isFull?: boolean,
  ) {
    return this.baitsService.getBaitInfo(id, { isFull });
  }
}
