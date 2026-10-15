const Favourite = require('./favourite.model');
const Destination = require('../destination/destination.model');

class FavouriteService {
  async getUserFavourites(userId) {
    return Favourite.find({ userId })
      .populate('destinationId')
      .sort({ createdAt: -1 });
  }

  async addFavourite(userId, destinationId) {
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      const error = new Error('Destination not found');
      error.statusCode = 404;
      throw error;
    }

    const existing = await Favourite.findOne({ userId, destinationId });
    if (existing) {
      return existing;
    }

    const favourite = await Favourite.create({ userId, destinationId });
    return favourite.populate('destinationId');
  }

  async removeFavourite(userId, destinationId) {
    const result = await Favourite.findOneAndDelete({ userId, destinationId });
    if (!result) {
      const error = new Error('Favourite record not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Removed from favourites successfully' };
  }

  async syncFavourites(userId, destinationIds = []) {
    if (!Array.isArray(destinationIds) || destinationIds.length === 0) {
      return this.getUserFavourites(userId);
    }

    const operations = destinationIds.map((destinationId) => ({
      updateOne: {
        filter: { userId, destinationId },
        update: { $setOnInsert: { userId, destinationId, createdAt: new Date() } },
        upsert: true,
      },
    }));

    await Favourite.bulkWrite(operations);
    return this.getUserFavourites(userId);
  }

  async checkIsFavourite(userId, destinationId) {
    const count = await Favourite.countDocuments({ userId, destinationId });
    return { isFavourite: count > 0 };
  }
}

module.exports = new FavouriteService();
