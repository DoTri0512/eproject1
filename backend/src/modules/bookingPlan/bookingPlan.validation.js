const { errorResponse } = require('../../utils/response');

const validateBookingPlan = (req, res, next) => {
  const { tourId, departureDate } = req.body;
  const errors = [];

  if (!tourId) {
    errors.push('Tour ID is required');
  }

  if (!departureDate) {
    errors.push('Departure date is required');
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

const validateAssignGuide = (req, res, next) => {
  const { guideId } = req.body;
  if (!guideId) {
    return errorResponse(res, 'Guide ID is required', 400);
  }
  next();
};

module.exports = {
  validateBookingPlan,
  validateAssignGuide,
};
