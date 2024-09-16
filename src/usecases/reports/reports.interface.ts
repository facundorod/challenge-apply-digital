import { ReportsRequestDTO } from '@/domain/dtos/reportsRequest.dto';
import { ReportsResponseDTO } from '@/domain/dtos/reportsResponse.dto';

export interface ReportsUseCase {
  execute(reportRequest: ReportsRequestDTO): Promise<ReportsResponseDTO>;
}
