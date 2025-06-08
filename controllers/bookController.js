const bookModel = require("../models/bookModel");
const { validationResult } = require("express-validator");
const reviewModel = require("../models/reviewModel");

module.exports.addbook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, author, genre, description, publishYear } = req.body;

    const newBook = new bookModel({
      title,
      author,
      genre,
      description,
      publishYear,
    });

    await newBook.save();

     res.status(201).json({
      message: "Book created successfully",
      book: newBook,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};



module.exports.getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;

    const query = {};
    if (author) query.author = author;
    if (genre) query.genre = genre;

    const books = await bookModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await bookModel.countDocuments(query);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      books,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports.getBookById=async(req,res)=>{
  try {
    const bookId=req.params.id;
    const {page=1,limit=5}=req.query;

     // Fetch book
    const book = await bookModel.findById(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

        // Fetch reviews with pagination
    const reviews = await reviewModel.find({ book: bookId })
      .populate("user", "name email") // assuming you store user info
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalReviews = await reviewModel.countDocuments({ book: bookId });

     // Calculate average rating
     const ratings=await reviewModel.aggregate([
       { $match: { book: book._id } },
       { $group: { _id: null, avgRating: { $avg: "$rating" } } },
     ])

     const averageRating = ratings[0]?.avgRating || 0;

      res.status(200).json({
      book,
      averageRating: averageRating.toFixed(2),
      totalReviews,
      currentPage: parseInt(page),
      reviews,
    });
  } catch (error) {
     res.status(500).json({ error: "Server error" });
  }
}

module.exports.searchBooks=async(req,res)=>{
  try {
    const { query } = req.query;
console.log(query);

    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const regex = new RegExp(query, "i"); // i = case-insensitive
console.log("🔍 Regex used:", regex); // Log regex
    const results = await bookModel.find({
      $or: [
        { title: { $regex: regex } },
        { author: { $regex: regex } },
      ],
    });
    
    res.status(200).json({ totalResults: results.length, books: results });
  } catch (error) {
   console.error("Search error:", error.message);
    
   return res.status(500).json({ error: error.message });
  }
}