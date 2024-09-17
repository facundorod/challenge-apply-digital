import { ApiProperty } from '@nestjs/swagger';

export class ReportsResponseDTO {
  @ApiProperty({
    description: 'Percentage of deleted products',
    type: 'number',
  })
  percentageOfDeletedProducts: number;
  @ApiProperty({
    description: 'Percentage of non deleted products',
    type: 'object',
    properties: {
      withPrice: {
        description: 'Percentage of non deleted products with price',
        type: 'number',
      },
      withoutPrice: {
        description: 'Percentage of non deleted products without price',
        type: 'number',
      },
      customDateRange: {
        description:
          'Percentage of non deleted products in a custom date range',
        type: 'number',
      },
    },
  })
  percentageOfNonDeletedProducts: {
    withPrice: number;
    withoutPrice: number;
    customDateRange: number;
  };

  @ApiProperty({
    description: 'Average price of non deleted products',
    type: 'number',
  })
  averagePriceOfNonDeletedProducts: number;
}
