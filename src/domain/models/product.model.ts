import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty({
    description: 'SKU of the product',
    example: 'ABC123',
  })
  private sku: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'iPhone 12',
  })
  private name: string;

  @ApiProperty({
    description: 'Brand of the product',
    example: 'Apple',
  })
  private brand: string;

  @ApiProperty({
    description: 'Model of the product',
    example: 'iPhone 12 Pro',
  })
  private model: string;

  @ApiProperty({
    description: 'Category of the product',
    example: 'Smartphone',
  })
  private category: string;

  @ApiProperty({
    description: 'Color of the product',
    example: 'Black',
  })
  private color: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 999.99,
  })
  private price: number;

  @ApiProperty({
    description: 'Currency for the price',
    example: 'USD',
  })
  private currency: string;

  @ApiProperty({
    description: 'Stock quantity of the product',
    example: 100,
  })
  private stock: number;

  @ApiProperty({
    description: 'Whether the product is deleted or not',
    example: false,
  })
  private isDeleted: boolean;

  constructor({
    sku,
    name,
    brand,
    model,
    category,
    color,
    price,
    currency,
    stock,
    isDeleted = false,
  }) {
    this.setSku(sku);
    this.setName(name);
    this.setBrand(brand);
    this.setModel(model);
    this.setCategory(category);
    this.setColor(color);
    this.setPrice(price);
    this.setCurrency(currency);
    this.setStock(stock);
    this.setIsDeleted(isDeleted);
  }

  public setIsDeleted(isDeleted: boolean): void {
    this.isDeleted = isDeleted;
  }

  public getIsDeleted(): boolean {
    return this.isDeleted;
  }

  public getSku(): string {
    return this.sku;
  }

  public setSku(sku: string): void {
    this.sku = sku;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getBrand(): string {
    return this.brand;
  }

  public setBrand(brand: string): void {
    this.brand = brand;
  }

  public getModel(): string {
    return this.model;
  }

  public setModel(model: string): void {
    this.model = model;
  }

  public getCategory(): string {
    return this.category;
  }

  public setCategory(category: string): void {
    this.category = category;
  }

  public getColor(): string {
    return this.color;
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public getPrice(): number {
    return this.price;
  }

  public setPrice(price: number): void {
    this.price = price;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public setCurrency(currency: string): void {
    this.currency = currency;
  }

  public getStock(): number {
    return this.stock;
  }

  public setStock(stock: number): void {
    this.stock = stock;
  }
}
