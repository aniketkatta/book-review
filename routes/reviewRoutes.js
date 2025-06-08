const express=require('express');
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

const reviewController=require('../controllers/reviewController');

router.post("/books/:id/reviews",authenticate,reviewController.addReview)
router.put("/reviews/:id", authenticate, reviewController.updateReview);
router.delete("/reviews/:id", authenticate, reviewController.deleteReview);
module.exports=router;