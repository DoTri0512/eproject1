const express = require('express');
const router = express.Router();
const destinationController = require('./destination.controller');
const { validateDestination } = require('./destination.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

router.get('/', destinationController.getAllDestinations);
router.get('/:idOrSlug', destinationController.getDestination);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateDestination,
  destinationController.createDestination
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateDestination,
  destinationController.updateDestination
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  destinationController.deleteDestination
);

module.exports = router;
