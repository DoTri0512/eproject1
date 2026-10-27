const statsService = require('./stats.service');
const { successResponse } = require('../../utils/response');

class StatsController {
  async getSummary(req, res, next) {
    try {
      const data = await statsService.getSummary();
      return successResponse(res, data, 'Stats summary retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StatsController();
