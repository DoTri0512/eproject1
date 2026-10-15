const favouriteService = require('./favourite.service');
const { successResponse } = require('../../utils/response');

class FavouriteController {
  async getMyFavourites(req, res, next) {
    try {
      const favourites = await favouriteService.getUserFavourites(req.user.id);
      return successResponse(res, favourites, 'Favourites retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async addFavourite(req, res, next) {
    try {
      const favourite = await favouriteService.addFavourite(
        req.user.id,
        req.body.destinationId
      );
      return successResponse(res, favourite, 'Added to favourites', 201);
    } catch (error) {
      next(error);
    }
  }

  async removeFavourite(req, res, next) {
    try {
      const result = await favouriteService.removeFavourite(
        req.user.id,
        req.params.destinationId
      );
      return successResponse(res, result, 'Removed from favourites');
    } catch (error) {
      next(error);
    }
  }

  async syncFavourites(req, res, next) {
    try {
      const favourites = await favouriteService.syncFavourites(
        req.user.id,
        req.body.destinationIds
      );
      return successResponse(res, favourites, 'Favourites synchronized successfully');
    } catch (error) {
      next(error);
    }
  }

  async checkFavourite(req, res, next) {
    try {
      const result = await favouriteService.checkIsFavourite(
        req.user.id,
        req.params.destinationId
      );
      return successResponse(res, result, 'Status checked');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FavouriteController();
