export class PaginatedDataDto<T> {
  totalItems: number;
  totalPages: number;
  page: number;
  data: T[];
}
