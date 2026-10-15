const destinationService = require('./destination.service');
const { successResponse } = require('../../utils/response');

class DestinationController {
  async getAllDestinations(req, res, next) {
    try {
      const result = await destinationService.getAllDestinations(req.query);
      return successResponse(res, result, 'Destinations retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getDestination(req, res, next) {
    try {
      const destination = await destinationService.getDestinationByIdOrSlug(req.params.idOrSlug);
      return successResponse(res, destination, 'Destination retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async createDestination(req, res, next) {
    try {
      const destination = await destinationService.createDestination(req.body);
      return successResponse(res, destination, 'Destination created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateDestination(req, res, next) {
    try {
      const destination = await destinationService.updateDestination(req.params.id, req.body);
      return successResponse(res, destination, 'Destination updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteDestination(req, res, next) {
    try {
      const result = await destinationService.deleteDestination(req.params.id);
      return successResponse(res, result, 'Destination deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DestinationController();
