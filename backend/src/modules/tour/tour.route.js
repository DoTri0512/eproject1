const express = require('express');
const router = express.Router();
const tourController = require('./tour.controller');
const { validateTour } = require('./tour.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

router.get('/', tourController.getAllTours);
router.get('/destination/:destinationId', tourController.getToursByDestination);
router.get('/:idOrSlug', tourController.getTour);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateTour,
  tourController.createTour
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateTour,
  tourController.updateTour
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  tourController.deleteTour
);

module.exports = router;
