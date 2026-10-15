const { errorResponse } = require('../../utils/response');

const validateGuide = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Guide name is required');
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

module.exports = {
  validateGuide,
};
