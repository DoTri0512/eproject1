const User = require('../auth/user.model');
const Customer = require('../customer/customer.model');
const Destination = require('../destination/destination.model');
const Tour = require('../tour/tour.model');
const Booking = require('../booking/booking.model');
const Guide = require('../guide/guide.model');
const { getPagination, formatPaginationResponse } = require('../../utils/pagination');

class AdminService {
  async getDashboardStats() {
    // Generate the last 6 months window
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        key: `T${d.getMonth() + 1}`,
      });
    }
    const startDate = new Date(months[0].year, months[0].month - 1, 1);

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
      monthlyAggregation,
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
            bookingStatus: 'completed',
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
          },
        },
      ]),
      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            bookings: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [
                  { $eq: ['$bookingStatus', 'completed'] },
                  '$totalAmount',
                  0,
                ],
              },
            },
          },
        },
      ]),
      Booking.find()
        .populate('userId', 'name email avatar')
        .populate('tourId', 'title slug price duration durationOptions overview')
        .populate('customerId')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const monthlyStats = months.map((m) => {
      const found = monthlyAggregation.find(
        (item) => item._id.year === m.year && item._id.month === m.month
      );
      return {
        month: m.key,
        year: m.year,
        revenue: found ? found.revenue : 0,
        bookings: found ? found.bookings : 0,
      };
    });

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
      monthlyStats,
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
