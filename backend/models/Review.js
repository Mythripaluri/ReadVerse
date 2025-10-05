const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [0.5, "Rating must be at least 0.5"],
    max: [5, "Rating cannot be more than 5"],
    validate: {
      validator: function (value) {
        // Check if rating is in 0.5 increments (0.5, 1.0, 1.5, 2.0, etc.)
        return (value * 2) % 1 === 0;
      },
      message:
        "Rating must be in 0.5 increments (0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0)",
    },
  },
  reviewText: {
    type: String,
    required: [true, "Review text is required"],
    trim: true,
    minlength: [10, "Review must be at least 10 characters"],
    maxlength: [1000, "Review cannot be more than 1000 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure one review per user per book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

// Update the updatedAt field before saving
reviewSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to calculate average rating for a book
reviewSchema.statics.calcAverageRating = async function (bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId },
    },
    {
      $group: {
        _id: "$book",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      // Round to nearest 0.5 for display purposes
      const roundedRating = Math.round(stats[0].averageRating * 2) / 2;
      await this.model("Book").findByIdAndUpdate(bookId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10, // Keep precise average
        displayRating: roundedRating, // Rounded to 0.5 for display
        reviewCount: stats[0].reviewCount,
      });
    } else {
      await this.model("Book").findByIdAndUpdate(bookId, {
        averageRating: 0,
        displayRating: 0,
        reviewCount: 0,
      });
    }
  } catch (error) {
    console.error("Error calculating average rating:", error);
  }
};

// Call calcAverageRating after save
reviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.book);
});

// Call calcAverageRating after remove
reviewSchema.post("remove", function () {
  this.constructor.calcAverageRating(this.book);
});

module.exports = mongoose.model("Review", reviewSchema);
