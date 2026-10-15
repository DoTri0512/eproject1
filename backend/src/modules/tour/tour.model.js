const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Destination ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Tour title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    duration: {
      days: { type: Number, default: 1 },
      nights: { type: Number, default: 0 },
      text: { type: String, default: '1 ngày' },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
    departureDates: {
      type: [Date],
      default: [],
    },
    maxPassengers: {
      type: Number,
      default: 20,
    },
    availableSeats: {
      type: Number,
      default: 20,
    },
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
      },
    ],
    includes: {
      type: [String],
      default: [],
    },
    excludes: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

tourSchema.index({ destinationId: 1 });
tourSchema.index({ price: 1 });
tourSchema.index({ status: 1 });

tourSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true, locale: 'vi' });
  }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
