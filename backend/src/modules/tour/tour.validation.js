const { errorResponse } = require('../../utils/response');

const validateTour = (req, res, next) => {
  const { destinationId, title, durationOptions, departureDates, maxPassengers } = req.body;
  const errors = [];

  if (!destinationId) {
    errors.push('Destination ID is required');
  }

  if (!title || title.trim().length === 0) {
    errors.push('Tour title is required');
  }

  if (!durationOptions || !Array.isArray(durationOptions) || durationOptions.length === 0) {
    errors.push('durationOptions is required and must be a non-empty array');
  } else {
    durationOptions.forEach((opt, idx) => {
      if (!opt || typeof opt !== 'object') {
        errors.push(`durationOptions[${idx}] must be an object`);
        return;
      }
      if (opt.days === undefined || Number(opt.days) < 1) {
        errors.push(`durationOptions[${idx}].days must be a number >= 1`);
      }
      if (opt.nights === undefined || Number(opt.nights) < 0) {
        errors.push(`durationOptions[${idx}].nights must be a number >= 0`);
      }
      if (opt.price === undefined || Number(opt.price) < 0) {
        errors.push(`durationOptions[${idx}].price must be a positive number`);
      }
    });
  }

  if (departureDates !== undefined && !Array.isArray(departureDates)) {
    errors.push('departureDates must be an array of dates');
  }

  if (maxPassengers !== undefined && (isNaN(Number(maxPassengers)) || Number(maxPassengers) < 1)) {
    errors.push('maxPassengers must be a positive number >= 1');
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

module.exports = {
  validateTour,
};
