import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Product } from '../models/product.model';

@ApiExtraModels(Product)
export class PaginatedDataDto<T> {
  @ApiProperty({ type: Number, description: 'Total items', example: 200 })
  totalItems: number;
  @ApiProperty({
    type: Number,
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;
  @ApiProperty({
    type: Number,
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    isArray: true,
    oneOf: [{ $ref: getSchemaPath(Product) }],
    description: 'Array of items of type T',
  })
  data: T[];
}
