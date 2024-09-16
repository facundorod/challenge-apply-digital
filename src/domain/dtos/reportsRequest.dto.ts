import { Type } from 'class-transformer';
import { IsDate, IsOptional, ValidateIf } from 'class-validator';

export class ReportsRequestDTO {
  @IsOptional()
  @IsDate({ message: 'startDate must be a valid date' })
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDate({ message: 'endDate must be a valid date' })
  @ValidateIf((o) => o.startDate && o.endDate)
  @Type(() => Date)
  endDate: Date;
}
