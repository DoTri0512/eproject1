const express = require('express');
const router = express.Router();
const customerController = require('./customer.controller');
const { validateCustomer } = require('./customer.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

router.get('/me', authenticate, customerController.getMyCustomerInfo);
router.post('/me', authenticate, validateCustomer, customerController.saveMyCustomerInfo);

router.get('/', authenticate, authorize('admin'), customerController.getAllCustomers);
router.get('/:id', authenticate, authorize('admin'), customerController.getCustomerById);
router.put('/:id', authenticate, authorize('admin'), customerController.updateCustomer);

module.exports = router;
