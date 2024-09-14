import { Product } from '@/domain/models/product.model';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'products' })
export class ProductTypeOrmEntity {
  @PrimaryColumn({ name: 'sku' })
  sku: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  brand: string;

  @Column({ type: 'varchar' })
  model: string;

  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'varchar' })
  color: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'varchar' })
  currency: string;

  @Column({ type: 'int' })
  stock: number;

  public convertToProductModel(): Product {
    return new Product({
      sku: this.sku,
      name: this.name,
      brand: this.brand,
      model: this.model,
      category: this.category,
      color: this.color,
      price: this.price,
      currency: this.currency,
      stock: this.stock,
    });
  }

  public convertToProductEntity(product: Product): void {
    this.sku = product.getSku();
    this.name = product.getName();
    this.brand = product.getBrand();
    this.model = product.getModel();
    this.category = product.getCategory();
    this.color = product.getColor();
    this.price = product.getPrice();
    this.currency = product.getCurrency();
    this.stock = product.getStock();
  }
}
