const { errorResponse } = require('../../utils/response');

const validateDestination = (req, res, next) => {
  const { name, region } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Destination name is required');
  }

  if (!region || region.trim().length === 0) {
    errors.push('Region is required');
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

module.exports = {
  validateDestination,
};
