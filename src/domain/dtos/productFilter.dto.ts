import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({
    description: 'Filter products by name',
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Filter products by category',
    type: String,
  })
  category?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiPropertyOptional({
    description:
      'Filter products with a price greater than or equal to this value',
    type: Number,
    example: 10,
  })
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiPropertyOptional({
    description:
      'Filter products with a price less than or equal to this value',
    type: Number,
    example: 100,
  })
  maxPrice?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Filter products by model',
    type: String,
  })
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Page number for pagination (default is 1)',
    type: Number,
    default: 1,
    example: 1,
  })
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Number of items per page (default is 5)',
    type: Number,
    example: 5,
    default: 5,
  })
  pageSize?: number = 5;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Filter products by currency',
    type: String,
  })
  currency?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Filter products by brand',
    type: String,
  })
  brand?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Filter products by color',
    type: String,
  })
  color?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({
    description:
      'Filter products with a stock greater than or equal to this value',
    type: Number,
    example: 10,
  })
  minStock?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({
    description:
      'Filter products with a stock less than or equal to this value',
    type: Number,
    example: 100,
  })
  maxStock?: number;

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  @ApiPropertyOptional({
    description: 'Order direction (ASC for ascending, DESC for descending)',
    type: String,
    enum: ['ASC', 'DESC'],
  })
  order?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  @IsIn(['name', 'category', 'price', 'stock'])
  @ApiPropertyOptional({
    description: 'Field to order the results by (e.g., name, price)',
    type: String,
  })
  orderBy?: string = 'name';
}
