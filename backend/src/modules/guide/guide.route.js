const express = require('express');
const router = express.Router();
const guideController = require('./guide.controller');
const { validateGuide } = require('./guide.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

router.get('/', guideController.getAllGuides);
router.get('/:idOrSlug', guideController.getGuide);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateGuide,
  guideController.createGuide
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
