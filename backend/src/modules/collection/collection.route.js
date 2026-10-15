const express = require('express');
const router = express.Router();
const collectionController = require('./collection.controller');
const { validateCollection } = require('./collection.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

router.get('/', collectionController.getAllCollections);
router.get('/:idOrSlug', collectionController.getCollection);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateCollection,
  collectionController.createCollection
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
