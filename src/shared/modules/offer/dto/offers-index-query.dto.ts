import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class OffersIndexQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public limit?: number;
}
