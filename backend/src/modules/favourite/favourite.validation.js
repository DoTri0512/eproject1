const { errorResponse } = require('../../utils/response');

const validateFavourite = (req, res, next) => {
  const destinationId = req.body.destinationId || req.params.destinationId;
  if (!destinationId) {
    return errorResponse(res, 'Destination ID is required', 400);
  }
  next();
};

module.exports = {
  validateFavourite,
};
