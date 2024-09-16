import { PaginatedDataDto } from '@/domain/dtos/paginatedData.dto';
import { ProductFilterDto } from '@/domain/dtos/productFilter.dto';
import { Product } from '@/domain/models/product.model';
import { UsecaseProxyModule } from '@/infrastructure/proxy/usecase/usecase-proxy.module';
import { UseCaseProxy } from '@/infrastructure/proxy/usecase/usecase.proxy';
import { GetAllProducts } from '@/usecases/get-products/get-products.usecase';
import { RemoveProductUseCase } from '@/usecases/remove-product/remove-product.interface';
import { Controller, Delete, Get, Inject, Param, Query } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(UsecaseProxyModule.GET_ALL_PRODUCTS_USE_CASE)
    private readonly getAllProductsUseCase: UseCaseProxy<GetAllProducts>,
    @Inject(UsecaseProxyModule.DELETE_PRODUCT_USE_CASE)
    private readonly removeProductUseCase: UseCaseProxy<RemoveProductUseCase>,
  ) {}

  @Get('')
  public async getAllProducts(
    @Query() filterProductDTO: ProductFilterDto,
  ): Promise<PaginatedDataDto<Product>> {
    const getAllProductsInstance = this.getAllProductsUseCase.getInstance();

    return getAllProductsInstance.execute(filterProductDTO);
  }

  @Delete(':sku')
  public async deleteProduct(
    @Param('sku') sku: string,
  ): Promise<{ message: string }> {
    const removeProductInstance = this.removeProductUseCase.getInstance();
    await removeProductInstance.execute(sku);

    return { message: 'Product deleted successfully' };
  }
}
