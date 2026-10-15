/**
 * Pagination helper
 */

const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const formatPaginationResponse = (data, totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit) || 1;

  return {
    items: data,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = {
  getPagination,
  formatPaginationResponse,
};
