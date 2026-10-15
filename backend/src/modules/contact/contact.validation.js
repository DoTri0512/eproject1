const { errorResponse } = require('../../utils/response');

const validateContact = (req, res, next) => {
  const { name, email, message } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('A valid email address is required');
  }

  if (!message || message.trim().length === 0) {
    errors.push('Message is required');
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

module.exports = {
  validateContact,
};
