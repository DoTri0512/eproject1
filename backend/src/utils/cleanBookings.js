const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/database');
const Booking = require('../modules/booking/booking.model');
const BookingPlan = require('../modules/bookingPlan/bookingPlan.model');
const Tour = require('../modules/tour/tour.model');
const User = require('../modules/auth/user.model');
const Customer = require('../modules/customer/customer.model');
const Destination = require('../modules/destination/destination.model');
const Guide = require('../modules/guide/guide.model');
const Collection = require('../modules/collection/collection.model');

const cleanBookingsAndPlans = async () => {
  try {
    await connectDB();
    console.log('[Clean] Connected to database.');

    // 1. Delete all bookings
    const delBookings = await Booking.deleteMany({});
    console.log(`[Clean] Deleted ${delBookings.deletedCount} bookings from database.`);

    // 2. Delete all booking plans
    const delPlans = await BookingPlan.deleteMany({});
    console.log(`[Clean] Deleted ${delPlans.deletedCount} booking plans from database.`);

    // 3. Reset availableSeats for all tours to maxPassengers
    const tours = await Tour.find({});
    for (const t of tours) {
      t.availableSeats = t.maxPassengers || 20;
      await t.save();
    }
    console.log(`[Clean] Reset availableSeats = maxPassengers for ${tours.length} tours.`);

    // 4. Update database/sample_data.json
    const allUsers = await User.find({}).select('+password').lean();
    const allCustomers = await Customer.find({}).lean();
    const allDestinations = await Destination.find({}).lean();
    const allTours = await Tour.find({}).lean();
    const allGuides = await Guide.find({}).lean();
    const allCollections = await Collection.find({}).lean();

    const exportPayload = {
      database: 'traveltrail',
      exportedAt: new Date().toISOString(),
      summary: {
        users: allUsers.length,
        customers: allCustomers.length,
        destinations: allDestinations.length,
        tours: allTours.length,
        guides: allGuides.length,
        collections: allCollections.length,
        bookings: 0,
        bookingPlans: 0,
      },
      collections: {
        users: allUsers,
        customers: allCustomers,
        destinations: allDestinations,
        tours: allTours,
        guides: allGuides,
        collections: allCollections,
        bookings: [],
        bookingPlans: [],
      },
    };

    const targetExportPath = path.resolve(__dirname, '../../../database/sample_data.json');
    fs.writeFileSync(targetExportPath, JSON.stringify(exportPayload, null, 2), 'utf-8');
    console.log(`[Clean] Successfully updated ${targetExportPath} with empty bookings & bookingPlans.`);

    console.log('\n[Clean] Finished successfully! You can now create new bookings and booking plans from the UI to test.');
    process.exit(0);
  } catch (error) {
    console.error('[Clean Error]', error);
    process.exit(1);
  }
};

cleanBookingsAndPlans();
