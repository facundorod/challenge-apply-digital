import { ProductFilterDto } from '@/domain/dtos/productFilter.dto';
import { Product } from '@/domain/models/product.model';

export interface ProductRepository {
  getAll(
    productFilterDTO: ProductFilterDto,
  ): Promise<{ products: Product[]; total: number }>;
  insert(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  bulkInsert(products: Product[]): Promise<void>;
  getBySku(sku: string): Promise<Product | null>;
  deleteBySku(sku: string): Promise<void>;
  countDeleted(): Promise<number>;
  countNotDeleted(): Promise<number>;
  count(): Promise<number>;
  countDeletedWithPrice(): Promise<number>;
  countDeletedByDateRange(startDate: Date, endDate: Date): Promise<number>;
  getAvgPriceOfNonDeletedProducts(): Promise<number>;
}
