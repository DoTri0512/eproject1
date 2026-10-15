const guideService = require('./guide.service');
const { successResponse } = require('../../utils/response');

class GuideController {
  async getAllGuides(req, res, next) {
    try {
      const result = await guideService.getAllGuides(req.query);
      return successResponse(res, result, 'Guides retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getGuide(req, res, next) {
    try {
      const guide = await guideService.getGuideByIdOrSlug(req.params.idOrSlug);
      return successResponse(res, guide, 'Guide retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async createGuide(req, res, next) {
    try {
      const guide = await guideService.createGuide(req.body);
      return successResponse(res, guide, 'Guide created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateGuide(req, res, next) {
    try {
      const guide = await guideService.updateGuide(req.params.id, req.body);
      return successResponse(res, guide, 'Guide updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteGuide(req, res, next) {
    try {
      const result = await guideService.deleteGuide(req.params.id);
      return successResponse(res, result, 'Guide deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GuideController();
