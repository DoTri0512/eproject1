const express = require('express');
const router = express.Router();
const uploadController = require('./upload.controller');
const upload = require('./upload.middleware');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

// Upload single image (field name: 'image')
router.post(
  '/single',
  authenticate,
  upload.single('image'),
  uploadController.uploadSingleImage
);

// Upload multiple images (field name: 'images', max 10 files)
router.post(
  '/multiple',
  authenticate,
  upload.array('images', 10),
  uploadController.uploadMultipleImages
);

// Delete uploaded image (Admin only)
router.delete(
  '/:filename',
  authenticate,
  authorize('admin'),
  uploadController.deleteImage
);

module.exports = router;
