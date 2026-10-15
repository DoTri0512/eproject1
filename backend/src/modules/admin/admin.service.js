const User = require('../auth/user.model');
const Customer = require('../customer/customer.model');
const Destination = require('../destination/destination.model');
const Tour = require('../tour/tour.model');
const Booking = require('../booking/booking.model');
const Guide = require('../guide/guide.model');
const { getPagination, formatPaginationResponse } = require('../../utils/pagination');

class AdminService {
  async getDashboardStats() {
    const [
      totalUsers,
      totalCustomers,
      totalDestinations,
      totalTours,
      totalGuides,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      revenueResult,
      recentBookings,
    ] = await Promise.all([
      User.countDocuments(),
      Customer.countDocuments(),
      Destination.countDocuments(),
      Tour.countDocuments(),
      Guide.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: 'pending' }),
      Booking.countDocuments({ bookingStatus: 'confirmed' }),
      Booking.countDocuments({ bookingStatus: 'completed' }),
      Booking.countDocuments({ bookingStatus: 'cancelled' }),
      Booking.aggregate([
        {
          $match: {
            bookingStatus: { $in: ['confirmed', 'completed'] },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
          },
        },
      ]),
      Booking.find()
        .populate('userId', 'name email avatar')
        .populate('tourId', 'title slug price')
        .populate('customerId')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return {
      kpi: {
        totalUsers,
        totalCustomers,
        totalDestinations,
        totalTours,
        totalGuides,
        totalBookings,
        totalRevenue,
      },
      bookingsBreakdown: {
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
      },
      recentBookings,
    };
  }

  async getAllUsers(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.role) {
      filter.role = query.role;
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    return formatPaginationResponse(items, totalItems, page, limit);
  }

  async updateUserRole(userId, role) {
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return { message: 'User deleted successfully' };
  }
}

module.exports = new AdminService();
