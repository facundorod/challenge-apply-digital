import { PaginatedDataDto } from '@/domain/dtos/paginatedData.dto';
import { ProductFilterDto } from '@/domain/dtos/productFilter.dto';
import { ReportsRequestDTO } from '@/domain/dtos/reportsRequest.dto';
import { ReportsResponseDTO } from '@/domain/dtos/reportsResponse.dto';
import { Product } from '@/domain/models/product.model';
import { Public } from '@/infrastructure/configuration/decorators/public.decorator';
import { UsecaseProxyModule } from '@/infrastructure/proxy/usecase/usecase-proxy.module';
import { UseCaseProxy } from '@/infrastructure/proxy/usecase/usecase.proxy';
import { GetAllProducts } from '@/usecases/get-products/get-products.usecase';
import { RemoveProductUseCase } from '@/usecases/remove-product/remove-product.interface';
import { ReportsUseCase } from '@/usecases/reports/reports.interface';
import { Controller, Delete, Get, Inject, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(UsecaseProxyModule.GET_ALL_PRODUCTS_USE_CASE)
    private readonly getAllProductsUseCase: UseCaseProxy<GetAllProducts>,
    @Inject(UsecaseProxyModule.DELETE_PRODUCT_USE_CASE)
    private readonly removeProductUseCase: UseCaseProxy<RemoveProductUseCase>,
    @Inject(UsecaseProxyModule.REPORTS_USE_CASE)
    private readonly reportUseCase: UseCaseProxy<ReportsUseCase>,
  ) {}

  @Get('')
  @Public()
  @ApiTags('Products')
  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({
    description: 'List of all paginated products',
    type: PaginatedDataDto<Product>,
  })
  public async getAllProducts(
    @Query() filterProductDTO: ProductFilterDto,
  ): Promise<PaginatedDataDto<Product>> {
    const getAllProductsInstance = this.getAllProductsUseCase.getInstance();

    return getAllProductsInstance.execute(filterProductDTO);
  }

  @Delete(':sku')
  @Public()
  @ApiTags('Products')
  @ApiOperation({ summary: 'Delete product by id (SKU)' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  public async deleteProduct(
    @Param('sku') sku: string,
  ): Promise<{ message: string }> {
    const removeProductInstance = this.removeProductUseCase.getInstance();
    await removeProductInstance.execute(sku);

    return { message: 'Product deleted successfully' };
  }

  @Get('reports')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Product reports' })
  @ApiOkResponse({
    description: 'Product reports generated successfully',
    type: ReportsResponseDTO,
  })
  @ApiBearerAuth('access-token')
  public async reports(
    @Query() reportDTO: ReportsRequestDTO,
  ): Promise<ReportsResponseDTO> {
    const reportUseCase = this.reportUseCase.getInstance();

    return reportUseCase.execute(reportDTO);
  }
}
