import { LoggerService } from '@/domain/ports/logger/logger.port';
import { ProductRepository } from '@/domain/ports/repositories/product.repository';
import { ReportsUseCase } from '../reports.interface';
import { Reports } from '../reports.usecase';
import { ReportsResponseDTO } from '@/domain/dtos/reportsResponse.dto';
import { ReportsRequestDTO } from '@/domain/dtos/reportsRequest.dto';

describe('Reports usecase test', () => {
  let productRepo: jest.Mocked<ProductRepository>;
  let loggerService: jest.Mocked<LoggerService>;
  let reportUseCase: ReportsUseCase;

  beforeAll(() => {
    productRepo = {
      getAvgPriceOfNonDeletedProducts: jest.fn(),
      count: jest.fn(),
      countDeletedWithPrice: jest.fn(),
      countDeleted: jest.fn(),
      countNotDeleted: jest.fn(),
      countDeletedByDateRange: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    loggerService = {
      log: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    reportUseCase = new Reports(loggerService, productRepo);
  });

  afterEach(() => jest.resetAllMocks());

  it('should calculate deleted products percentage correctly', async () => {
    productRepo.count.mockResolvedValue(100);
    productRepo.countDeleted.mockResolvedValue(50);

    const reportDto: ReportsRequestDTO = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    };

    const result: ReportsResponseDTO = await reportUseCase.execute(reportDto);

    expect(productRepo.count).toHaveBeenCalledTimes(1);
    expect(productRepo.countDeleted).toHaveBeenCalledTimes(1);
    expect(result.percentageOfDeletedProducts).toBe(50);
  });

  it('should return zero percentage when no products exist', async () => {
    productRepo.count.mockResolvedValue(0);
    productRepo.countDeleted.mockResolvedValue(0);

    const reportDto: ReportsRequestDTO = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    };

    const result: ReportsResponseDTO = await reportUseCase.execute(reportDto);

    expect(result.percentageOfDeletedProducts).toBe(0);
  });

  it('should calculate non-deleted products with and without price correctly', async () => {
    productRepo.countNotDeleted.mockResolvedValue(50);
    productRepo.countDeletedWithPrice.mockResolvedValue(30);

    const reportDto: ReportsRequestDTO = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    };

    const result: ReportsResponseDTO = await reportUseCase.execute(reportDto);

    expect(productRepo.countDeletedWithPrice).toHaveBeenCalledTimes(1);
    expect(result.percentageOfNonDeletedProducts.withPrice).toBe(60);
    expect(result.percentageOfNonDeletedProducts.withoutPrice).toBe(40);
  });

  it('should return zero for non-deleted products when no products exist', async () => {
    productRepo.countNotDeleted.mockResolvedValue(0);

    const reportDto: ReportsRequestDTO = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    };

    const result: ReportsResponseDTO = await reportUseCase.execute(reportDto);

    expect(result.percentageOfNonDeletedProducts.withPrice).toBe(0);
    expect(result.percentageOfNonDeletedProducts.withoutPrice).toBe(0);
  });

  it('should calculate non-deleted products in date range correctly', async () => {
    productRepo.countNotDeleted.mockResolvedValue(50);
    productRepo.countDeletedByDateRange.mockResolvedValue(20);

    const reportDto: ReportsRequestDTO = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    };

    const result: ReportsResponseDTO = await reportUseCase.execute(reportDto);

    expect(productRepo.countDeletedByDateRange).toHaveBeenCalledWith(
      reportDto.startDate,
      reportDto.endDate,
    );
    expect(result.percentageOfNonDeletedProducts.customDateRange).toBe(40);
  });

  it('should calculate average price of non-deleted products correctly', async () => {
    productRepo.getAvgPriceOfNonDeletedProducts.mockResolvedValue(150);

    const reportDto: ReportsRequestDTO = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    };

    const result: ReportsResponseDTO = await reportUseCase.execute(reportDto);

    expect(productRepo.getAvgPriceOfNonDeletedProducts).toHaveBeenCalledTimes(
      1,
    );
    expect(result.averagePriceOfNonDeletedProducts).toBe(150);
  });
});
