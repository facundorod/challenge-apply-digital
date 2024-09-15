import { PaginatedDataDto } from '@/domain/dtos/paginatedData.dto';
import { ProductFilterDto } from '@/domain/dtos/productFilter.dto';
import { Product } from '@/domain/models/product.model';
import { UsecaseProxyModule } from '@/infrastructure/proxy/usecase/usecase-proxy.module';
import { UseCaseProxy } from '@/infrastructure/proxy/usecase/usecase.proxy';
import { GetAllProducts } from '@/usecases/get-products/get-products.usecase';
import { Controller, Get, Inject, Query } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(UsecaseProxyModule.GET_ALL_PRODUCTS_USE_CASE)
    private readonly getAllProductsUseCase: UseCaseProxy<GetAllProducts>,
  ) {}

  @Get('')
  public async getAllProducts(
    @Query() filterProductDTO: ProductFilterDto,
  ): Promise<PaginatedDataDto<Product>> {
    const getAllProductsInstance = this.getAllProductsUseCase.getInstance();

    return getAllProductsInstance.execute(filterProductDTO);
  }
}
