const mongoose = require('mongoose');
const slugify = require('slugify');
const Guide = require('./guide.model');
const { getPagination, formatPaginationResponse } = require('../../utils/pagination');

class GuideService {
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
        .populate('destinations', 'name slug image location')
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

    const guide = await Guide.findOne(query).populate('destinations', 'name slug image location');
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

    return Guide.create(data);
  }

  async updateGuide(id, data) {
    if (data.name) {
      data.slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
    }

    const guide = await Guide.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('destinations', 'name slug');

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
}

module.exports = new GuideService();
