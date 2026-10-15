const { errorResponse } = require('../../utils/response');

const validateTour = (req, res, next) => {
  const { destinationId, title, price } = req.body;
  const errors = [];

  if (!destinationId) {
    errors.push('Destination ID is required');
  }

  if (!title || title.trim().length === 0) {
    errors.push('Tour title is required');
  }

  if (price === undefined || price === null || Number(price) < 0) {
    errors.push('A valid positive price is required');
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

module.exports = {
  validateTour,
};
