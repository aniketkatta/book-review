const reviewModel=require('../models/reviewModel');
const bookModel=require('../models/bookModel');

module.exports.addReview=async(req,res)=>{
    try {
        const bookId=req.params.id;
    const userId=req.user._id;
    const {rating,comment}=req.body;

    const book=await bookModel.findById(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    const existingReview=await reviewModel.findOne({book:bookId,user:userId});
    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this book" });
    }

    const review=new reviewModel({
        book:bookId,
        user:userId,
        rating,
        comment
    })

    await review.save();

    book.reviews.push(review._id);
    await book.save();

    res.status(201).json({ message: "Review submitted successfully", review });
    
    } catch (error) {
     res.status(500).json({ error: "Server error" });   
    }
}


module.exports.updateReview=async(req,res)=>{
    try {
        const reviewId=req.params.id;
        const userId=req.user._id;

        const {rating,comment}=req.body;

        const review=await reviewModel.findById(reviewId);
        if (!review) return res.status(404).json({ error: "Review not found" });

         // Check if the review belongs to the logged-in user
        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Not authorized to update this review" });
        }

        // Update fields
        if (rating !== undefined) review.rating = rating;
        if (comment !== undefined) review.comment = comment;

        await review.save();

        res.status(200).json({ message: "Review updated", review });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}

module.exports.deleteReview=async(req,res)=>{
    try {
        const reviewId = req.params.id;
        const userId = req.user._id;

        const review = await reviewModel.findById(reviewId);
        if (!review) return res.status(404).json({ error: "Review not found" });

        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Not authorized to delete this review" });
        }

        await bookModel.updateOne(
            { _id: review.book },
            { $pull: { reviews: review._id } }
        );

        await review.deleteOne();

        res.status(200).json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}