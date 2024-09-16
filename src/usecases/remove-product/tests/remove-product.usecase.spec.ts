import { LoggerService } from '@/domain/ports/logger/logger.port';
import { ProductRepository } from '@/domain/ports/repositories/product.repository';
import { RemoveProductUseCase } from '../remove-product.interface';
import { RemoveProduct } from '../remove-product.usecase';
import { ProductNotFound } from '@/domain/errors/productNotFound.error';
import { Product } from '@/domain/models/product.model';

describe('Remove product usecase', () => {
  let loggerService: jest.Mocked<LoggerService>;
  let productRepository: jest.Mocked<ProductRepository>;
  let removeProducts: RemoveProductUseCase;

  beforeAll(() => {
    loggerService = {
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      log: jest.fn(),
    };
    productRepository = {
      deleteBySku: jest.fn(),
      getBySku: jest.fn(),
      update: jest.fn(),
    } as undefined as jest.Mocked<ProductRepository>;

    removeProducts = new RemoveProduct(loggerService, productRepository);
  });
  afterAll(() => jest.resetAllMocks());

  it('should thrown an error if the product does not exist', async () => {
    const sku = 'invalidSKU';
    productRepository.getBySku.mockResolvedValueOnce(null);
    await expect(removeProducts.execute(sku)).rejects.toThrow(ProductNotFound);
  });

  it('should delete the product', async () => {
    const sku = '1123A';
    const product = new Product({
      sku: sku,
      name: 'Test product',
      model: 'Test model',
      category: 'Test category',
      brand: 'Test brand',
      color: 'Blue',
      currency: 'USD',
      price: 1123,
      stock: 1,
    });
    productRepository.getBySku.mockResolvedValueOnce(product);
    product.setIsDeleted(true);
    await removeProducts.execute(sku);

    expect(productRepository.update).toHaveBeenCalledWith(product);
  });
});
