const mongoose = require('mongoose');
const slugify = require('slugify');
const Guide = require('./guide.model');
const Destination = require('../destination/destination.model');
const { getPagination, formatPaginationResponse } = require('../../utils/pagination');

class GuideService {
  /**
   * Helper: Check if all destination IDs exist in Destination collection
   */
  async validateDestinationsExist(destinationIds) {
    if (!destinationIds || destinationIds.length === 0) return [];

    const stringIds = destinationIds.map((id) => id.toString());
    const validDestinations = await Destination.find({ _id: { $in: stringIds } }).select('_id name');

    if (validDestinations.length !== stringIds.length) {
      const foundIds = validDestinations.map((d) => d._id.toString());
      const missingIds = stringIds.filter((id) => !foundIds.includes(id));
      const error = new Error(`Không tìm thấy điểm đến với ID: ${missingIds.join(', ')}`);
      error.statusCode = 404;
      throw error;
    }

    return validDestinations;
  }

  async getAllGuides(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.destinationId) {
      filter.destinations = query.destinationId;
    }

    if (query.language && query.language !== 'Tất cả') {
      filter.languages = { $regex: query.language, $options: 'i' };
    }

    if (query.specialisation && query.specialisation !== 'Tất cả') {
      filter.specialisation = { $regex: query.specialisation, $options: 'i' };
    }

    if (query.search) {
      const searchRegex = { $regex: query.search, $options: 'i' };
      filter.$or = [
        { name: searchRegex },
        { specialisation: searchRegex },
        { languages: searchRegex },
        { biography: searchRegex },
        { background: searchRegex },
      ];
    }

    const [items, totalItems] = await Promise.all([
      Guide.find(filter)
        .populate('destinations', 'name slug image location region theme')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Guide.countDocuments(filter),
    ]);

    return formatPaginationResponse(items, totalItems, page, limit);
  }

  async getGuideByIdOrSlug(idOrSlug) {
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const guide = await Guide.findOne(query).populate(
      'destinations',
      'name slug image location region theme overview attractions activities'
    );

    if (!guide) {
      const error = new Error('Guide not found');
      error.statusCode = 404;
      throw error;
    }

    return guide;
  }

  async createGuide(data) {
    if (data.name && !data.slug) {
      data.slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
    }

    if (data.destinations && data.destinations.length > 0) {
      await this.validateDestinationsExist(data.destinations);
    }

    const createdGuide = await Guide.create(data);
    return Guide.findById(createdGuide._id).populate(
      'destinations',
      'name slug image location region theme'
    );
  }

  async updateGuide(id, data) {
    if (data.name) {
      data.slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
    }

    if (data.destinations && data.destinations.length > 0) {
      await this.validateDestinationsExist(data.destinations);
    }

    const guide = await Guide.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('destinations', 'name slug image location region theme');

    if (!guide) {
      const error = new Error('Guide not found');
      error.statusCode = 404;
      throw error;
    }

    return guide;
  }

  async deleteGuide(id) {
    const guide = await Guide.findByIdAndDelete(id);
    if (!guide) {
      const error = new Error('Guide not found');
      error.statusCode = 404;
      throw error;
    }

    return { message: 'Guide deleted successfully' };
  }

  /**
   * Thêm danh sách điểm đến guide phụ trách (không trùng lặp)
   */
  async addDestinationsToGuide(id, destinationIds) {
    const guide = await Guide.findById(id);
    if (!guide) {
      const error = new Error('Guide not found');
      error.statusCode = 404;
      throw error;
    }

    await this.validateDestinationsExist(destinationIds);

    const currentIds = (guide.destinations || []).map((d) => d.toString());
    const newIds = destinationIds
      .map((d) => d.toString())
      .filter((destId) => !currentIds.includes(destId));

    if (newIds.length > 0) {
      guide.destinations.push(...newIds);
      await guide.save();
    }

    return Guide.findById(id).populate(
      'destinations',
      'name slug image location region theme overview attractions activities'
    );
  }

  /**
   * Cập nhật toàn bộ danh sách điểm đến guide phụ trách
   */
  async setGuideDestinations(id, destinationIds) {
    const guide = await Guide.findById(id);
    if (!guide) {
      const error = new Error('Guide not found');
      error.statusCode = 404;
      throw error;
    }

    await this.validateDestinationsExist(destinationIds);

    const uniqueIds = Array.from(new Set(destinationIds.map((d) => d.toString())));
    guide.destinations = uniqueIds;
    await guide.save();

    return Guide.findById(id).populate(
      'destinations',
      'name slug image location region theme overview attractions activities'
    );
  }

  /**
   * Xóa một điểm đến khỏi danh sách phụ trách của guide
   */
  async removeDestinationFromGuide(id, destinationId) {
    const guide = await Guide.findById(id);
    if (!guide) {
      const error = new Error('Guide not found');
      error.statusCode = 404;
      throw error;
    }

    guide.destinations = (guide.destinations || []).filter(
      (d) => d.toString() !== destinationId.toString()
    );
    await guide.save();

    return Guide.findById(id).populate(
      'destinations',
      'name slug image location region theme overview attractions activities'
    );
  }

  /**
   * Xem danh sách các điểm đến mà guide phụ trách
   */
  async getGuideDestinations(idOrSlug) {
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const guide = await Guide.findOne(query).populate(
      'destinations',
      'name slug image location region theme overview attractions activities'
    );

    if (!guide) {
      const error = new Error('Guide not found');
      error.statusCode = 404;
      throw error;
    }

    return guide.destinations;
  }
}

module.exports = new GuideService();
