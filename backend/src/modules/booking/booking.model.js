const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Tour ID is required'],
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    departureDate: {
      type: Date,
      required: [true, 'Departure date is required'],
    },
    endDate: {
      type: Date,
    },
    numberOfGuests: {
      adults: { type: Number, default: 1, min: 1 },
      children: { type: Number, default: 0, min: 0 },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'credit_card', 'bank_transfer', 'e_wallet'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'completed'],
      default: 'pending',
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
    },
    guide_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guide',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ userId: 1 });
bookingSchema.index({ tourId: 1 });
bookingSchema.index({ departureDate: 1 });
bookingSchema.index({ bookingStatus: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
