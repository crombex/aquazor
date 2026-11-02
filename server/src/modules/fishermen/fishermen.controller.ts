import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FishermenService } from './fishermen.service';

@Controller('fishermen')
export class FishermenController {
  constructor(private fishermenService: FishermenService) {}

  @Get(':id')
  getFisherman(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.fishermenService.findOneById(id);
  }
}
