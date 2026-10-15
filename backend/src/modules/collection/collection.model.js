const mongoose = require('mongoose');
const slugify = require('slugify');

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
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


collectionSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: 'vi' });
  }
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
