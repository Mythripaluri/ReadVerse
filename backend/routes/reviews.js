const express = require("express");
const { body } = require("express-validator");
const {
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Validation rules for review creation/update
const reviewValidation = [
  body("book")
    .notEmpty()
    .withMessage("Book ID is required")
    .isMongoId()
    .withMessage("Invalid book ID"),
  body("rating")
    .isFloat({ min: 0.5, max: 5 })
    .withMessage("Rating must be between 0.5 and 5")
    .custom((value) => {
      // Check if rating is in 0.5 increments
      if ((value * 2) % 1 !== 0) {
        throw new Error(
          "Rating must be in 0.5 increments (0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0)"
        );
      }
      return true;
    }),
  body("reviewText")
    .trim()
    .notEmpty()
    .withMessage("Review text is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Review text must be between 10 and 1000 characters"),
];

const reviewUpdateValidation = [
  body("rating")
    .isFloat({ min: 0.5, max: 5 })
    .withMessage("Rating must be between 0.5 and 5")
    .custom((value) => {
      // Check if rating is in 0.5 increments
      if ((value * 2) % 1 !== 0) {
        throw new Error(
          "Rating must be in 0.5 increments (0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0)"
        );
      }
      return true;
    }),
  body("reviewText")
    .trim()
    .notEmpty()
    .withMessage("Review text is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Review text must be between 10 and 1000 characters"),
];

// Routes
router.post("/", protect, reviewValidation, createReview);
router.put("/:id", protect, reviewUpdateValidation, updateReview);
router.delete("/:id", protect, deleteReview);
router.get("/user/me", protect, getUserReviews);

module.exports = router;
