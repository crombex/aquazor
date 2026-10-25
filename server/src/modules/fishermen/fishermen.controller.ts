import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { FishermenService } from './fishermen.service';

@Controller('fishermen')
export class FishermenController {
  constructor(private fishermenService: FishermenService) {}

  @Get(':id')
  getFishermanInfo(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('isFull', new ParseBoolPipe({ optional: true })) isFull?: boolean,
  ) {
    return this.fishermenService.getFishermanInfo(id, { isFull });
  }
}
