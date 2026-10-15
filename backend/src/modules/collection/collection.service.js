const mongoose = require('mongoose');
const slugify = require('slugify');
const Collection = require('./collection.model');
const { getPagination, formatPaginationResponse } = require('../../utils/pagination');

class CollectionService {
  async getAllCollections(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      Collection.find(filter)
        .populate('destinations', 'name slug image location region theme')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Collection.countDocuments(filter),
    ]);

    return formatPaginationResponse(items, totalItems, page, limit);
  }

  async getCollectionByIdOrSlug(idOrSlug) {
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const collection = await Collection.findOne(query).populate(
      'destinations',
      'name slug image location region theme'
    );

    if (!collection) {
      const error = new Error('Collection not found');
      error.statusCode = 404;
      throw error;
    }

    return collection;
  }

  async createCollection(data) {
    if (data.name && !data.slug) {
      data.slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
    }

    return Collection.create(data);
  }

  async updateCollection(id, data) {
    if (data.name) {
      data.slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
    }

    const collection = await Collection.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('destinations', 'name slug image');

    if (!collection) {
      const error = new Error('Collection not found');
      error.statusCode = 404;
      throw error;
    }

    return collection;
  }

  async deleteCollection(id) {
    const collection = await Collection.findByIdAndDelete(id);
    if (!collection) {
      const error = new Error('Collection not found');
      error.statusCode = 404;
      throw error;
    }

    return { message: 'Collection deleted successfully' };
  }
}

module.exports = new CollectionService();
