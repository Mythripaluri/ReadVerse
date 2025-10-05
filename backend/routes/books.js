const express = require("express");
const { body } = require("express-validator");
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getUserBooks,
} = require("../controllers/bookController");
const { getBookReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Validation rules for book creation/update
const bookValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("author")
    .trim()
    .notEmpty()
    .withMessage("Author is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Author must be between 1 and 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),
  body("genre")
    .trim()
    .notEmpty()
    .withMessage("Genre is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Genre must be between 1 and 50 characters"),
  body("publishedYear")
    .isNumeric()
    .withMessage("Published year must be a number")
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(
      `Published year must be between 1000 and ${new Date().getFullYear()}`
    ),
];

// Routes
router.get("/", getBooks);
router.get("/user/me", protect, getUserBooks);
router.get("/:id", getBook);
router.get("/:bookId/reviews", getBookReviews);
router.post("/", protect, bookValidation, createBook);
router.put("/:id", protect, bookValidation, updateBook);
router.delete("/:id", protect, deleteBook);

module.exports = router;
