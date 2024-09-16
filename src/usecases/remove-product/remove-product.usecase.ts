import { LoggerService } from '@/domain/ports/logger/logger.port';
import { RemoveProductUseCase } from './remove-product.interface';
import { ProductRepository } from '@/domain/ports/repositories/product.repository';
import { ProductNotFound } from '@/domain/errors/productNotFound.error';

export class RemoveProduct implements RemoveProductUseCase {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(productSku: string): Promise<void> {
    this.loggerService.log(`Deleting product ${productSku}...`);

    const product = await this.productRepository.getBySku(productSku);

    if (!product) throw new ProductNotFound();

    product.setIsDeleted(true);
    await this.productRepository.update(product);

    this.loggerService.log(
      `Product ${productSku} mark as deleted successfully`,
    );
  }
}
