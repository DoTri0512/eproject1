const mongoose = require('mongoose');
const slugify = require('slugify');
const Destination = require('./destination.model');
const { getPagination, formatPaginationResponse } = require('../../utils/pagination');

class DestinationService {
  async getAllDestinations(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.region) {
      filter.region = { $regex: query.region, $options: 'i' };
    }

    if (query.theme) {
      filter.theme = { $regex: query.theme, $options: 'i' };
    }

    if (query.budgetBand) {
      filter.budgetBand = query.budgetBand;
    }

    if (query.bestSeason) {
      filter.bestSeason = { $regex: query.bestSeason, $options: 'i' };
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { location: { $regex: query.search, $options: 'i' } },
        { overview: { $regex: query.search, $options: 'i' } },
        { region: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      Destination.find(filter)
        .populate('relatedDestinations', 'name slug image location')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Destination.countDocuments(filter),
    ]);

    return formatPaginationResponse(items, totalItems, page, limit);
  }

  async getDestinationByIdOrSlug(idOrSlug) {
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const destination = await Destination.findOne(query).populate(
      'relatedDestinations',
      'name slug image location region theme'
    );

    if (!destination) {
      const error = new Error('Destination not found');
      error.statusCode = 404;
      throw error;
    }

    return destination;
  }

  async createDestination(data) {
    if (data.name && !data.slug) {
      data.slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
    }

    return Destination.create(data);
  }

  async updateDestination(id, data) {
    if (data.name) {
      data.slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
    }

    const destination = await Destination.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!destination) {
      const error = new Error('Destination not found');
      error.statusCode = 404;
      throw error;
    }

    return destination;
  }

  async deleteDestination(id) {
    const destination = await Destination.findByIdAndDelete(id);
    if (!destination) {
      const error = new Error('Destination not found');
      error.statusCode = 404;
      throw error;
    }

    return { message: 'Destination deleted successfully' };
  }
}

module.exports = new DestinationService();
