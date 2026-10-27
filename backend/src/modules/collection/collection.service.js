const mongoose = require('mongoose');
const slugify = require('slugify');
const Collection = require('./collection.model');
const Destination = require('../destination/destination.model');
const { getPagination, formatPaginationResponse } = require('../../utils/pagination');

class CollectionService {
  /**
   * Helper: Kiểm tra điểm đến có tồn tại và đảm bảo chưa thuộc collection nào khác
   */
  async validateDestinationsNotInOtherCollections(destinationIds, excludeCollectionId = null) {
    if (!destinationIds || destinationIds.length === 0) return [];

    const stringIds = destinationIds.map((id) => id.toString());

    // 1. Kiểm tra tất cả điểm đến có tồn tại trong collection Destination không
    const validDestinations = await Destination.find({ _id: { $in: stringIds } }).select('_id name');
    if (validDestinations.length !== stringIds.length) {
      const foundIds = validDestinations.map((d) => d._id.toString());
      const missingIds = stringIds.filter((id) => !foundIds.includes(id));
      const error = new Error(`Không tìm thấy điểm đến với ID: ${missingIds.join(', ')}`);
      error.statusCode = 404;
      throw error;
    }

    // 2. Kiểm tra các điểm đến đã thuộc collection khác chưa
    const query = {
      destinations: { $in: stringIds },
    };

    if (excludeCollectionId) {
      query._id = { $ne: excludeCollectionId };
    }

    const conflictingCollections = await Collection.find(query).populate('destinations', 'name');

    if (conflictingCollections.length > 0) {
      const conflicts = [];

      conflictingCollections.forEach((col) => {
        col.destinations.forEach((dest) => {
          if (dest && stringIds.includes(dest._id.toString())) {
            conflicts.push(`"${dest.name || dest._id}" (đang thuộc bộ sưu tập "${col.name}")`);
          }
        });
      });

      const conflictMsg =
        conflicts.length > 0
          ? `Không thể thêm điểm đến vì đã thuộc bộ sưu tập khác: ${conflicts.join(', ')}. Một điểm đến chỉ có thể thuộc tối đa 1 bộ sưu tập.`
          : 'Một số điểm đến đã thuộc về bộ sưu tập khác.';

      const error = new Error(conflictMsg);
      error.statusCode = 400;
      throw error;
    }

    return validDestinations;
  }

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
        .populate('destinations', 'name slug image location region theme overview')
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
      'name slug image location region theme overview attractions activities'
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

    if (data.destinations && data.destinations.length > 0) {
      await this.validateDestinationsNotInOtherCollections(data.destinations, null);
    }

    const created = await Collection.create(data);
    return Collection.findById(created._id).populate(
      'destinations',
      'name slug image location region theme overview'
    );
  }

  async updateCollection(id, data) {
    if (data.name) {
      data.slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
    }

    if (data.destinations && data.destinations.length > 0) {
      await this.validateDestinationsNotInOtherCollections(data.destinations, id);
    }

    const collection = await Collection.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('destinations', 'name slug image location region theme overview');

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

  /**
   * Thêm danh sách điểm đến vào collection (nếu chưa có trong collection khác)
   */
  async addDestinationsToCollection(id, destinationIds) {
    const collection = await Collection.findById(id);
    if (!collection) {
      const error = new Error('Collection not found');
      error.statusCode = 404;
      throw error;
    }

    // Đảm bảo không điểm đến nào nằm trong collection khác
    await this.validateDestinationsNotInOtherCollections(destinationIds, collection._id);

    const currentIds = (collection.destinations || []).map((d) => d.toString());
    const newIds = destinationIds
      .map((d) => d.toString())
      .filter((destId) => !currentIds.includes(destId));

    if (newIds.length > 0) {
      collection.destinations.push(...newIds);
      await collection.save();
    }

    return Collection.findById(id).populate(
      'destinations',
      'name slug image location region theme overview attractions activities'
    );
  }

  /**
   * Xóa một điểm đến khỏi collection
   */
  async removeDestinationFromCollection(id, destinationId) {
    const collection = await Collection.findById(id);
    if (!collection) {
      const error = new Error('Collection not found');
      error.statusCode = 404;
      throw error;
    }

    collection.destinations = (collection.destinations || []).filter(
      (d) => d.toString() !== destinationId.toString()
    );
    await collection.save();

    return Collection.findById(id).populate(
      'destinations',
      'name slug image location region theme overview attractions activities'
    );
  }

  /**
   * Xóa nhiều điểm đến khỏi collection (Batch remove)
   */
  async removeDestinationsFromCollection(id, destinationIds) {
    const collection = await Collection.findById(id);
    if (!collection) {
      const error = new Error('Collection not found');
      error.statusCode = 404;
      throw error;
    }

    const stringIdsToRemove = destinationIds.map((d) => d.toString());
    collection.destinations = (collection.destinations || []).filter(
      (d) => !stringIdsToRemove.includes(d.toString())
    );
    await collection.save();

    return Collection.findById(id).populate(
      'destinations',
      'name slug image location region theme overview attractions activities'
    );
  }

  /**
   * Xem thông tin các điểm đến trong collection
   */
  async getCollectionDestinations(idOrSlug) {
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const collection = await Collection.findOne(query).populate(
      'destinations',
      'name slug image location region theme overview attractions activities'
    );

    if (!collection) {
      const error = new Error('Collection not found');
      error.statusCode = 404;
      throw error;
    }

    return collection.destinations;
  }
}

module.exports = new CollectionService();
