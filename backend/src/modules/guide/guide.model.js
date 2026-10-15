const mongoose = require('mongoose');
const slugify = require('slugify');

const guideSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Guide name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    background: {
      type: String,
      default: '',
    },
    specialisation: {
      type: String,
      default: '',
    },
    biography: {
      type: String,
      default: '',
    },
    languages: {
      type: [String],
      default: ['Tiếng Việt'],
    },
    destinations: [
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


guideSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: 'vi' });
  }
});

const Guide = mongoose.model('Guide', guideSchema);

module.exports = Guide;
