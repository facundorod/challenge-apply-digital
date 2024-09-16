import { PaginatedDataDto } from '@/domain/dtos/paginatedData.dto';
import { ProductFilterDto } from '@/domain/dtos/productFilter.dto';
import { Product } from '@/domain/models/product.model';

export interface GetProductsUseCase {
  execute(productFilter: ProductFilterDto): Promise<PaginatedDataDto<Product>>;
}
