const mongoose = require('mongoose');

const bookingPlanSchema = new mongoose.Schema(
  {
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Tour ID is required'],
    },
    departureDate: {
      type: Date,
      required: [true, 'Departure date is required'],
    },
    endDate: {
      type: Date,
    },
    guideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guide',
      default: null,
    },
    totalPassengers: {
      type: Number,
      default: 0,
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
    passengersList: [
      {
        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Booking',
        },
        fullName: {
          type: String,
          required: true,
        },
        gender: {
          type: String,
          enum: ['male', 'female', 'other'],
          default: 'other',
        },
        dob: {
          type: Date,
        },
        idCardNumber: {
          type: String,
          default: '',
        },
        phone: {
          type: String,
          default: '',
        },
      },
    ],
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

bookingPlanSchema.index({ tourId: 1, departureDate: 1 }, { unique: true });

const BookingPlan = mongoose.model('BookingPlan', bookingPlanSchema);

module.exports = BookingPlan;
