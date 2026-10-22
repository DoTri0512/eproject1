const bookingPlanService = require('./bookingPlan.service');
const { successResponse } = require('../../utils/response');

class BookingPlanController {
  async getAllPlans(req, res, next) {
    try {
      const result = await bookingPlanService.getAllPlans(req.query);
      return successResponse(res, result, 'Booking plans retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getPlanById(req, res, next) {
    try {
      const plan = await bookingPlanService.getPlanById(req.params.id);
      return successResponse(res, plan, 'Booking plan retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async createPlan(req, res, next) {
    try {
      const plan = await bookingPlanService.createPlan(req.body);
      return successResponse(res, plan, 'Booking plan created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async syncPlansFromBookings(req, res, next) {
    try {
      const plans = await bookingPlanService.syncFromBookings();
      return successResponse(
        res,
        plans,
        'Đã đồng bộ thành công ' + plans.length + ' đoàn khởi hành từ các đơn đặt tour'
      );
    } catch (error) {
      next(error);
    }
  }

  async assignGuide(req, res, next) {
    try {
      const plan = await bookingPlanService.assignGuide(req.params.id, req.body.guideId);
      return successResponse(res, plan, 'Guide assigned successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const plan = await bookingPlanService.updateStatus(req.params.id, req.body.status);
      return successResponse(res, plan, 'Plan status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async addPassenger(req, res, next) {
    try {
      const plan = await bookingPlanService.addPassenger(req.params.id, req.body);
      return successResponse(res, plan, 'Passenger added to plan successfully');
    } catch (error) {
      next(error);
    }
  }

  async deletePlan(req, res, next) {
    try {
      const result = await bookingPlanService.deletePlan(req.params.id);
      return successResponse(res, result, 'Booking plan deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingPlanController();
