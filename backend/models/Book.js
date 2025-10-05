const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [200, "Title cannot be more than 200 characters"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true,
    maxlength: [100, "Author name cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [2000, "Description cannot be more than 2000 characters"],
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    trim: true,
    maxlength: [50, "Genre cannot be more than 50 characters"],
  },
  publishedYear: {
    type: Number,
    required: [true, "Published year is required"],
    min: [1000, "Published year must be at least 1000"],
    max: [new Date().getFullYear(), "Published year cannot be in the future"],
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  displayRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
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

// Update the updatedAt field before saving
bookSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for reviews
bookSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "book",
});

// Ensure virtual fields are serialised
bookSchema.set("toJSON", { virtuals: true });
bookSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Book", bookSchema);
