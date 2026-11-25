import { IsOptional, Min, Max, IsInt } from 'class-validator';

export class GetHistoryDTO {
  @IsOptional()
  @IsInt()
  @Max(50)
  @Min(10)
  limit!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset!: number;
}
