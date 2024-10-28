import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max } from 'class-validator';

export class FindItemsWithPaginationDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Max(1000)
  @Transform((v) => Number(v.value))
  size?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @Transform((v) => Number(v.value))
  page?: number;
}

export class FindItemResponseDto {
  market_hash_name: string;
  min_price_tradable: number | null;
  min_price_not_tradable: number | null;

  constructor(dto: FindItemRepositoryResponseDto) {
    this.market_hash_name = dto.market_hash_name;
    this.min_price_tradable = dto.min_price_tradable
      ? parseFloat(dto.min_price_tradable)
      : null;
    this.min_price_not_tradable = dto.min_price_not_tradable
      ? parseFloat(dto.min_price_not_tradable)
      : null;
  }
}

export interface FindItemsWithPaginationRepositoryDto {
  limit: number;
  offset: number;
}

export interface FindItemRepositoryResponseDto {
  market_hash_name: string;
  min_price_tradable: string | null;
  min_price_not_tradable: string | null;
}
