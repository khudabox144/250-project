const paginate = (query, page, limit) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

module.exports = { paginate };
