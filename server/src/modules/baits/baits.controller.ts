import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BaitsService } from './baits.service';

@Controller('baits')
export class BaitsController {
  constructor(private baitsService: BaitsService) {}

  @Get(':id')
  getBait(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.baitsService.findOneById(id);
  }
}
