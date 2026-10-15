const customerService = require('./customer.service');
const { successResponse } = require('../../utils/response');

class CustomerController {
  async getMyCustomerInfo(req, res, next) {
    try {
      const customer = await customerService.getCustomerByUserId(req.user.id);
      return successResponse(res, customer, 'Customer info retrieved');
    } catch (error) {
      next(error);
    }
  }

  async saveMyCustomerInfo(req, res, next) {
    try {
      const customer = await customerService.createOrUpdateCustomer(req.body, req.user.id);
      return successResponse(res, customer, 'Customer info saved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllCustomers(req, res, next) {
    try {
      const result = await customerService.getAllCustomers(req.query);
      return successResponse(res, result, 'Customer list retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCustomerById(req, res, next) {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      return successResponse(res, customer, 'Customer retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateCustomer(req, res, next) {
    try {
      const customer = await customerService.updateCustomer(req.params.id, req.body);
      return successResponse(res, customer, 'Customer updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CustomerController();
