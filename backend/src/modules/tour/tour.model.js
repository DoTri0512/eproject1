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
    overview: {
      type: String,
      trim: true,
      default: '',
    },
    durationOptions: [
      {
        days: { type: Number, required: true, min: 1 },
        nights: { type: Number, required: true, min: 0 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    departureDates: {
      type: [Date],
      default: [],
    },
    maxPassengers: {
      type: Number,
      required: [true, 'Max passengers is required'],
      default: 20,
      min: 1,
    },
    availableSeats: {
      type: Number,
      default: function () {
        return this.maxPassengers || 20;
      },
      min: 0,
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
tourSchema.index({ 'durationOptions.price': 1 });
tourSchema.index({ status: 1 });

tourSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true, locale: 'vi' });
  }
  if (this.isNew && (this.availableSeats === undefined || this.availableSeats === null)) {
    this.availableSeats = this.maxPassengers || 20;
  }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
