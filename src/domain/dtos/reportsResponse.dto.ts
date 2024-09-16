export class ReportsResponseDTO {
  percentageOfDeletedProducts: number;
  percentageOfNonDeletedProducts: {
    withPrice: number;
    withoutPrice: number;
    customDateRange: number;
  };
  averagePriceOfNonDeletedProducts: number;
}
