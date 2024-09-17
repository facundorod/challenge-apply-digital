import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ReportsRequestDTO } from '../reportsRequest.dto';

describe('ReportsRequestDTO', () => {
  it('should succeed with valid dates', async () => {
    const dto = plainToClass(ReportsRequestDTO, {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if startDate is not a valid date', async () => {
    const dto = plainToClass(ReportsRequestDTO, {
      startDate: 'invalid-date',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isDate).toBe(
      'startDate must be a valid date',
    );
  });

  it('should fail if endDate is not a valid date', async () => {
    const dto = plainToClass(ReportsRequestDTO, {
      startDate: '2024-01-01',
      endDate: 'invalid-date',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isDate).toBe('endDate must be a valid date');
  });

  it('should succeed if no dates are provided (optional)', async () => {
    const dto = plainToClass(ReportsRequestDTO, {});

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass when startDate and endDate are both valid', async () => {
    const dto = plainToClass(ReportsRequestDTO, {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
