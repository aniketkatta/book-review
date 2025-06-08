const express = require("express");
const { body } = require("express-validator");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();
const bookController = require("../controllers/bookController");
router.post(
  "/",
  authenticate,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("author").notEmpty().withMessage("Author is required"),
    body("genre").notEmpty().withMessage("Genre is required"),
  ],
  bookController.addbook
);


router.get("/search",bookController.searchBooks);
router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);

module.exports = router;
