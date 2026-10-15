const { errorResponse } = require('../../utils/response');

const validateUpdateRole = (req, res, next) => {
  const { role } = req.body;
  if (!role || !['user', 'admin'].includes(role)) {
    return errorResponse(res, 'Valid role is required (user or admin)', 400);
  }
  next();
};

module.exports = {
  validateUpdateRole,
};
