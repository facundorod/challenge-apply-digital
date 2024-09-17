import { validate } from 'class-validator';
import { ProductFilterDto } from '../productFilter.dto';
import { plainToInstance } from 'class-transformer';

describe('ProductFilterDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new ProductFilterDto();
    dto.name = 'Laptop';
    dto.category = 'Electronics';
    dto.minPrice = 100;
    dto.maxPrice = 1000;
    dto.page = 1;
    dto.pageSize = 10;
    dto.order = 'ASC';
    dto.orderBy = 'price';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should use default values if none are provided', async () => {
    const dto = new ProductFilterDto();

    expect(dto.page).toBe(1);
    expect(dto.pageSize).toBe(5);
    expect(dto.order).toBe('DESC');
    expect(dto.orderBy).toBe('name');

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid order value', async () => {
    const dto = new ProductFilterDto();
    dto.order = 'INVALID_ORDER' as 'ASC' | 'DESC';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isIn).toContain(
      'order must be one of the following values: ASC, DESC',
    );
  });

  it('should fail validation with invalid orderBy value', async () => {
    const dto = new ProductFilterDto();
    dto.orderBy = 'invalid_field';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isIn).toContain(
      'orderBy must be one of the following values: name, category, price, stock',
    );
  });

  it('should fail validation when page is less than 1', async () => {
    const dto = new ProductFilterDto();
    dto.page = 0;

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.min).toContain(
      'page must not be less than 1',
    );
  });

  it('should transform values correctly with plainToInstance', async () => {
    const plainObject = {
      page: '2',
      pageSize: '10',
      minPrice: '100',
      maxPrice: '500',
    };

    const dto = plainToInstance(ProductFilterDto, plainObject);

    expect(dto.page).toBe(2);
    expect(dto.pageSize).toBe(10);
    expect(dto.minPrice).toBe(100);
    expect(dto.maxPrice).toBe(500);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when minPrice is negative', async () => {
    const dto = new ProductFilterDto();
    dto.minPrice = -5;

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isPositive).toContain(
      'minPrice must be a positive number',
    );
  });
});
