const express = require('express');
const router = express.Router();
const guideController = require('./guide.controller');
const { validateGuide, validateGuideDestinations } = require('./guide.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

// Public routes
router.get('/', guideController.getAllGuides);
router.get('/:idOrSlug/destinations', guideController.getGuideDestinations);
router.get('/:idOrSlug', guideController.getGuide);

// Admin-only routes
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateGuide,
  guideController.createGuide
);

router.post(
  '/:id/destinations',
  authenticate,
  authorize('admin'),
  validateGuideDestinations,
  guideController.addDestinations
);

router.put(
  '/:id/destinations',
  authenticate,
  authorize('admin'),
  validateGuideDestinations,
  guideController.setGuideDestinations
);

router.delete(
  '/:id/destinations/:destinationId',
  authenticate,
  authorize('admin'),
  guideController.removeDestination
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateGuide,
  guideController.updateGuide
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  guideController.deleteGuide
);

module.exports = router;
