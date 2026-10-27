const mongoose = require('mongoose');
const { errorResponse } = require('../../utils/response');

const validateGuide = (req, res, next) => {
  const { name, destinations } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Guide name is required');
  }

  if (destinations !== undefined) {
    if (!Array.isArray(destinations)) {
      errors.push('destinations must be an array of destination IDs');
    } else {
      const invalidIds = destinations.filter((id) => !mongoose.Types.ObjectId.isValid(id));
      if (invalidIds.length > 0) {
        errors.push(`Invalid destination ID(s): ${invalidIds.join(', ')}`);
      }
    }
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

const validateGuideDestinations = (req, res, next) => {
  let { destinationIds, destinationId } = req.body;
  const errors = [];

  if (!destinationIds && destinationId) {
    destinationIds = [destinationId];
    req.body.destinationIds = destinationIds;
  }

  if (!destinationIds || !Array.isArray(destinationIds) || destinationIds.length === 0) {
    errors.push('destinationIds must be a non-empty array of destination IDs');
  } else {
    const invalidIds = destinationIds.filter((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      errors.push(`Invalid destination ID(s): ${invalidIds.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

module.exports = {
  validateGuide,
  validateGuideDestinations,
};
