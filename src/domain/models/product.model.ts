export class Product {
  private sku: string;
  private name: string;
  private brand: string;
  private model: string;
  private category: string;
  private color: string;
  private price: number;
  private currency: string;
  private stock: number;

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
