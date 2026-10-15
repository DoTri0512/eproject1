const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const {
  validateRegister,
  validateLogin,
  validateChangePassword,
} = require('./auth.validation');
const { authenticate } = require('../../middlewares/auth.middleware');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);

router.get('/me', authenticate, authController.getProfile);
router.put('/me', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, validateChangePassword, authController.changePassword);

module.exports = router;
