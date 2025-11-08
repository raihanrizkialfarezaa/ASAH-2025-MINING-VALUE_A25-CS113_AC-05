export const calculatePagination = (page = 1, limit = 10, total) => {
  const currentPage = parseInt(page, 10);
  const perPage = parseInt(limit, 10);
  const totalPages = Math.ceil(total / perPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    total,
    page: currentPage,
    limit: perPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};

export const getPaginationParams = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
