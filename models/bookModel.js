const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishYear: {
    type: Number,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});


const bookModel=mongoose.model('Book',bookSchema);
module.exports=bookModel;