import { ProductFilterDto } from '@/domain/dtos/productFilter.dto';
import { Product } from '@/domain/models/product.model';

export interface ProductRepository {
  getAll(
    productFilterDTO: ProductFilterDto,
  ): Promise<{ products: Product[]; total: number }>;
  insert(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  bulkInsert(products: Product[]): Promise<void>;
}
