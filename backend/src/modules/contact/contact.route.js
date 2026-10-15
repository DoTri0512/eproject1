const express = require('express');
const router = express.Router();
const contactController = require('./contact.controller');
const { validateContact } = require('./contact.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

// Public route to submit contact inquiry
router.post('/', validateContact, contactController.submitContact);

// Admin routes
router.get('/', authenticate, authorize('admin'), contactController.getAllContacts);
router.put('/:id/status', authenticate, authorize('admin'), contactController.updateContactStatus);
router.delete('/:id', authenticate, authorize('admin'), contactController.deleteContact);

module.exports = router;
