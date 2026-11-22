import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class BaitDTO {
  @IsUUID(4)
  id!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class StartFishingDTO {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @ArrayUnique()
  @IsUUID(4, { each: true })
  rods!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @ArrayUnique((bait: BaitDTO) => bait.id)
  @ValidateNested({ each: true })
  @Type(() => BaitDTO)
  baits!: BaitDTO[];

  @IsUUID(4)
  fisherman!: string;

  @IsUUID(4)
  location!: string;
}
