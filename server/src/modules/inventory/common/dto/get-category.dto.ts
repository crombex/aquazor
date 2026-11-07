import { IsEnum } from 'class-validator';
import { EInventoryCategories } from '../inventory.types';

export class GetCategoryDTO {
  @IsEnum(EInventoryCategories)
  category!: EInventoryCategories;
}
