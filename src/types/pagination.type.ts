export interface PaginationResponse<T> {
  data: T[];
  totalData: number;
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasMore: boolean;
}
