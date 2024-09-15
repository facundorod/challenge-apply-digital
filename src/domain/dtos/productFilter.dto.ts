export class ProductFilterDto {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  model?: string;
  page?: number = 1;
  pageSize?: number = 5;
  currency?: string;
  brand?: string;
  color?: string;
  minStock?: number;
  maxStock?: number;
  order?: 'ASC' | 'DESC' = 'DESC';
  orderBy?: string = 'name';
}
