import { ReportsResponseDTO } from '@/domain/dtos/reportsResponse.dto';
import { ReportsUseCase } from './reports.interface';
import { LoggerService } from '@/domain/ports/logger/logger.port';
import { ProductRepository } from '@/domain/ports/repositories/product.repository';
import { ReportsRequestDTO } from '@/domain/dtos/reportsRequest.dto';

export class Reports implements ReportsUseCase {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly productRepository: ProductRepository,
  ) {}
  async execute(reportDto: ReportsRequestDTO): Promise<ReportsResponseDTO> {
    this.loggerService.log(`Executing reports...`);
    const deletedProductsPercentage =
      await this.calculateDeletedProductsPercentage();

    const { withPrice, withoutPrice } =
      await this.calculateNonDeletedProductsWithAndWithoutPrice();

    const nonDeletedProductsByDate =
      await this.calculateNonDeletedProductsByDateRange(
        reportDto.startDate,
        reportDto.endDate,
      );

    const avgNonDeletedProducts =
      await this.calculateAveragePriceOfNonDeletedProducts();

    return {
      averagePriceOfNonDeletedProducts: avgNonDeletedProducts,
      percentageOfDeletedProducts: deletedProductsPercentage,
      percentageOfNonDeletedProducts: {
        customDateRange: nonDeletedProductsByDate,
        withoutPrice: withoutPrice,
        withPrice: withPrice,
      },
    };
  }

  private async calculateDeletedProductsPercentage(): Promise<number> {
    const totalProducts = await this.productRepository.count();
    const totalProductsDeleted = await this.productRepository.countDeleted();

    if (!totalProducts) return 0;

    return (totalProductsDeleted / totalProducts) * 100;
  }

  private async calculateNonDeletedProductsWithAndWithoutPrice(): Promise<{
    withPrice: number;
    withoutPrice: number;
  }> {
    const totalProductsNotDeleted =
      await this.productRepository.countNotDeleted();

    if (!totalProductsNotDeleted) return { withoutPrice: 0, withPrice: 0 };

    const totalProductsWithPrice =
      await this.productRepository.countDeletedWithPrice();

    const totalProductsWithoutPrice =
      totalProductsNotDeleted - totalProductsWithPrice;

    return {
      withoutPrice: (totalProductsWithoutPrice / totalProductsNotDeleted) * 100,
      withPrice: (totalProductsWithPrice / totalProductsNotDeleted) * 100,
    };
  }

  private async calculateNonDeletedProductsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const totalProductsDeleted = await this.productRepository.countNotDeleted();

    const productsInRange =
      await this.productRepository.countDeletedByDateRange(startDate, endDate);

    if (!totalProductsDeleted) return 0;

    return (productsInRange / totalProductsDeleted) * 100;
  }

  private async calculateAveragePriceOfNonDeletedProducts(): Promise<number> {
    return this.productRepository.getAvgPriceOfNonDeletedProducts();
  }
}
