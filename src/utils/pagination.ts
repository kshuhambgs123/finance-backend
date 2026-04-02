export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const getPaginationParams = (options: PaginationOptions) => {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(
    Math.max(1, options.limit || parseInt(process.env.DEFAULT_PAGE_SIZE || '20')),
    parseInt(process.env.MAX_PAGE_SIZE || '100')
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const createPaginationResult = <T>(
  data: T[],
  totalItems: number,
  page: number,
  limit: number
): PaginationResult<T> => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};