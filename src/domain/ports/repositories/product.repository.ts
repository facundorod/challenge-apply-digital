import { Product } from '@/domain/models/product.model';

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  insert(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  bulkInsert(products: Product[]): Promise<void>;
}
