const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Destination ID is required'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

favouriteSchema.index({ userId: 1, destinationId: 1 }, { unique: true });

const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourite;
