const adminService = require('./admin.service');
const { successResponse } = require('../../utils/response');

class AdminController {
  async getDashboardStats(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      return successResponse(res, stats, 'Dashboard analytics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const result = await adminService.getAllUsers(req.query);
      return successResponse(res, result, 'User list retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const user = await adminService.updateUserRole(req.params.id, req.body.role);
      return successResponse(res, user, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await adminService.deleteUser(req.params.id);
      return successResponse(res, result, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
