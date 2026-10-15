const tourService = require('./tour.service');
const { successResponse } = require('../../utils/response');

class TourController {
  async getAllTours(req, res, next) {
    try {
      const result = await tourService.getAllTours(req.query);
      return successResponse(res, result, 'Tours retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getTour(req, res, next) {
    try {
      const tour = await tourService.getTourByIdOrSlug(req.params.idOrSlug);
      return successResponse(res, tour, 'Tour retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getToursByDestination(req, res, next) {
    try {
      const tours = await tourService.getToursByDestination(req.params.destinationId);
      return successResponse(res, tours, 'Destination tours retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async createTour(req, res, next) {
    try {
      const tour = await tourService.createTour(req.body);
      return successResponse(res, tour, 'Tour created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateTour(req, res, next) {
    try {
      const tour = await tourService.updateTour(req.params.id, req.body);
      return successResponse(res, tour, 'Tour updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteTour(req, res, next) {
    try {
      const result = await tourService.deleteTour(req.params.id);
      return successResponse(res, result, 'Tour deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TourController();
