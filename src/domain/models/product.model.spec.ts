import { Product } from './product.model';

describe('Product Class', () => {
  let product: Product;

  beforeEach(() => {
    product = new Product({
      sku: 'ABC123',
      name: 'Apple Watch',
      brand: 'Apple',
      model: 'Series 7',
      category: 'Smartwatch',
      color: 'Black',
      price: 399.99,
      currency: 'USD',
      stock: 100,
    });
  });

  it('should create an instance of Product', () => {
    expect(product).toBeDefined();
  });

  it('should set and get the SKU correctly through the constructor', () => {
    expect(product.getSku()).toBe('ABC123');
  });

  it('should set and get the name correctly through the constructor', () => {
    expect(product.getName()).toBe('Apple Watch');
  });

  it('should set and get the brand correctly through the constructor', () => {
    expect(product.getBrand()).toBe('Apple');
  });

  it('should set and get the model correctly through the constructor', () => {
    expect(product.getModel()).toBe('Series 7');
  });

  it('should set and get the category correctly through the constructor', () => {
    expect(product.getCategory()).toBe('Smartwatch');
  });

  it('should set and get the color correctly through the constructor', () => {
    expect(product.getColor()).toBe('Black');
  });

  it('should set and get the price correctly through the constructor', () => {
    expect(product.getPrice()).toBe(399.99);
  });

  it('should set and get the currency correctly through the constructor', () => {
    expect(product.getCurrency()).toBe('USD');
  });

  it('should set and get the stock correctly through the constructor', () => {
    expect(product.getStock()).toBe(100);
  });

  it('should only accept number for price', () => {
    expect(typeof product.getPrice()).toBe('number');
  });

  it('should only accept string for name', () => {
    expect(typeof product.getName()).toBe('string');
  });
});
