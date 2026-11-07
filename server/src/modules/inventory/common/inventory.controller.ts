import {
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { GetCategoryDTO } from './dto/get-category.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { UseUser } from '../../auth/auth.decorators';
import { EInventoryCategories } from './inventory.types';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @UseGuards(AuthGuard)
  @Get('my')
  async getUserInventory(
    @UseUser('sub') userId: string,
    @Query('category') { category }: GetCategoryDTO,
  ) {
    return await this.inventoryService.getUserInventory({
      userId,
      category: category,
    });
  }
}
