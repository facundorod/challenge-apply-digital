import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
  Min,
  IsIn,
} from 'class-validator';

export class ProductFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  pageSize?: number = 5;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  minStock?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  maxStock?: number;

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  @IsIn(['name', 'category', 'price', 'stock'])
  orderBy?: string = 'name';
}
