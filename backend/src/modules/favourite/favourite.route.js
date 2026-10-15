const express = require('express');
const router = express.Router();
const favouriteController = require('./favourite.controller');
const { validateFavourite } = require('./favourite.validation');
const { authenticate } = require('../../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', favouriteController.getMyFavourites);
router.post('/', validateFavourite, favouriteController.addFavourite);
router.post('/sync', favouriteController.syncFavourites);
router.get('/check/:destinationId', favouriteController.checkFavourite);
router.delete('/:destinationId', favouriteController.removeFavourite);

module.exports = router;
