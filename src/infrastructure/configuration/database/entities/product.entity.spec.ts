import { ProductTypeOrmEntity } from './product.entity';
import { Product } from '@/domain/models/product.model';

describe('ProductTypeOrmEntity', () => {
  let productEntity: ProductTypeOrmEntity;

  beforeEach(() => {
    productEntity = new ProductTypeOrmEntity();
    productEntity.sku = 'ABC123';
    productEntity.name = 'Apple Watch';
    productEntity.brand = 'Apple';
    productEntity.model = 'Series 7';
    productEntity.category = 'Smartwatch';
    productEntity.color = 'Black';
    productEntity.price = 399.99;
    productEntity.currency = 'USD';
    productEntity.stock = 50;
    productEntity.isDeleted = true;
  });

  it('should initialize entity fields correctly', () => {
    expect(productEntity.sku).toBe('ABC123');
    expect(productEntity.name).toBe('Apple Watch');
    expect(productEntity.brand).toBe('Apple');
    expect(productEntity.model).toBe('Series 7');
    expect(productEntity.category).toBe('Smartwatch');
    expect(productEntity.color).toBe('Black');
    expect(productEntity.price).toBe(399.99);
    expect(productEntity.currency).toBe('USD');
    expect(productEntity.stock).toBe(50);
    expect(productEntity.isDeleted).toBe(true);
  });

  it('should convert entity to Product model correctly', () => {
    const productModel = productEntity.convertToProductModel();

    expect(productModel).toBeInstanceOf(Product);
    expect(productModel.getSku()).toBe('ABC123');
    expect(productModel.getName()).toBe('Apple Watch');
    expect(productModel.getBrand()).toBe('Apple');
    expect(productModel.getModel()).toBe('Series 7');
    expect(productModel.getCategory()).toBe('Smartwatch');
    expect(productModel.getColor()).toBe('Black');
    expect(productModel.getPrice()).toBe(399.99);
    expect(productModel.getCurrency()).toBe('USD');
    expect(productModel.getStock()).toBe(50);
    expect(productModel.getIsDeleted()).toBe(true);
  });
});
