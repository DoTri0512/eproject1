const Customer = require('./customer.model');
const { getPagination, formatPaginationResponse } = require('../../utils/pagination');

class CustomerService {
  async createOrUpdateCustomer(customerData, userId = null) {
    if (userId) {
      let customer = await Customer.findOne({ userId });
      if (customer) {
        Object.assign(customer, customerData);
        return customer.save();
      }
    }

    return Customer.create({
      ...customerData,
      ...(userId && { userId }),
    });
  }

  async getCustomerByUserId(userId) {
    return Customer.findOne({ userId });
  }

  async getCustomerById(id) {
    const customer = await Customer.findById(id);
    if (!customer) {
      const error = new Error('Customer not found');
      error.statusCode = 404;
      throw error;
    }
    return customer;
  }

  async getAllCustomers(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.search) {
      filter.$or = [
        { fullName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { phone: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      Customer.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Customer.countDocuments(filter),
    ]);

    return formatPaginationResponse(items, totalItems, page, limit);
  }

  async updateCustomer(id, data) {
    const customer = await Customer.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      const error = new Error('Customer not found');
      error.statusCode = 404;
      throw error;
    }
    return customer;
  }
}

module.exports = new CustomerService();
