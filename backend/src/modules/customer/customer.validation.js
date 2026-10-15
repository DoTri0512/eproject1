const { errorResponse } = require('../../utils/response');

const validateCustomer = (req, res, next) => {
  const { fullName, email, phone } = req.body;
  const errors = [];

  if (!fullName || fullName.trim().length === 0) {
    errors.push('Full name is required');
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('A valid email address is required');
  }

  if (!phone || phone.trim().length === 0) {
    errors.push('Phone number is required');
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

module.exports = {
  validateCustomer,
};
