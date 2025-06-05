export interface IPagination {
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface IApiResponse<T> {
  data?: T[];
  pagination?: IPagination;
}
