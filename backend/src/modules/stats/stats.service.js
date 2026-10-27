const Destination = require('../destination/destination.model');
const Tour = require('../tour/tour.model');
const Booking = require('../booking/booking.model');

class StatsService {
  /**
   * GET /api/v1/stats/summary
   * Public endpoint — trả về các con số thống kê dùng cho trang About Us.
   */
  async getSummary() {
    const [
      totalDestinations,
      totalTours,
      totalBookings,
      regionsResult,
    ] = await Promise.all([
      Destination.countDocuments(),
      Tour.countDocuments(),
      Booking.countDocuments({ bookingStatus: { $in: ['confirmed', 'completed'] } }),
      // Đếm số region duy nhất trong collection destinations
      Destination.distinct('region'),
    ]);

    return {
      totalDestinations,
      totalTours,
      totalBookings,
      totalRegions: regionsResult.length,
    };
  }
}

module.exports = new StatsService();
