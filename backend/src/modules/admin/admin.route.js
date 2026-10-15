const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { validateUpdateRole } = require('./admin.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

// All admin routes require authentication and admin role
router.use(authenticate, authorize('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', validateUpdateRole, adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
