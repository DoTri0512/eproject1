const mongoose = require('mongoose');
const slugify = require('slugify');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    region: {
      type: String,
      required: [true, 'Region is required'],
      trim: true,
    },
    theme: {
      type: String,
      trim: true,
      default: 'General',
    },
    image: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    climate: {
      type: String,
      trim: true,
      default: '',
    },
    overview: {
      type: String,
      trim: true,
      default: '',
    },
    attractions: {
      type: [String],
      default: [],
    },
    activities: {
      type: [String],
      default: [],
    },
    bestSeason: {
      type: String,
      trim: true,
      default: '',
    },
    visitDuration: {
      type: String,
      trim: true,
      default: '',
    },
    budgetBand: {
      type: String,
      trim: true,
      default: '',
    },
    transport: {
      type: String,
      trim: true,
      default: '',
    },
    relatedDestinations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
      },
    ],
  },
  {
    timestamps: true,
  }
);

destinationSchema.index({ name: 1 });
destinationSchema.index({ region: 1 });
destinationSchema.index({ theme: 1 });
destinationSchema.index({ budgetBand: 1 });
destinationSchema.index({ bestSeason: 1 });
destinationSchema.index({
  name: 'text',
  location: 'text',
  overview: 'text',
});

destinationSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: 'vi' });
  }
});

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;
