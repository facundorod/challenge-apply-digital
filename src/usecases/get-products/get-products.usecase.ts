import { PaginatedDataDto } from '@/domain/dtos/paginatedData.dto';
import { ProductFilterDto } from '@/domain/dtos/productFilter.dto';
import { Product } from '@/domain/models/product.model';
import { GetProductsUseCase } from './get-products.interface';
import { LoggerService } from '@/domain/ports/logger/logger.port';
import { ProductRepository } from '@/domain/ports/repositories/product.repository';

export class GetAllProducts implements GetProductsUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    productFilter: ProductFilterDto,
  ): Promise<PaginatedDataDto<Product>> {
    this.logger.log(`Getting all products...`);

    productFilter.page = (productFilter.page - 1) * productFilter.pageSize;

    const { products, total } =
      await this.productRepository.getAll(productFilter);

    if (!total)
      return {
        data: [],
        page: 0,
        totalItems: 0,
        totalPages: 0,
      };

    return {
      data: products,
      totalItems: total,
      page: productFilter.page,
      totalPages: Math.ceil(total / productFilter.pageSize),
    };
  }
}
