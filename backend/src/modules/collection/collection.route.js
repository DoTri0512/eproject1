const express = require('express');
const router = express.Router();
const collectionController = require('./collection.controller');
const {
  validateCollection,
  validateCollectionDestinations,
} = require('./collection.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

// Public routes
router.get('/', collectionController.getAllCollections);
router.get('/:idOrSlug/destinations', collectionController.getCollectionDestinations);
router.get('/:idOrSlug', collectionController.getCollection);

// Admin-only routes
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateCollection,
  collectionController.createCollection
);

router.post(
  '/:id/destinations',
  authenticate,
  authorize('admin'),
  validateCollectionDestinations,
  collectionController.addDestinations
);

router.delete(
  '/:id/destinations/:destinationId',
  authenticate,
  authorize('admin'),
  collectionController.removeDestination
);

router.delete(
  '/:id/destinations',
  authenticate,
  authorize('admin'),
  validateCollectionDestinations,
  collectionController.removeDestinations
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateCollection,
  collectionController.updateCollection
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  collectionController.deleteCollection
);

module.exports = router;
