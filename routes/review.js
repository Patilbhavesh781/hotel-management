const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/WrapAsync.js")
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");
const {validateReview, isLoggedIn, isReviewAuthor, isUser} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js");

// post Review Route

router.post("/",isLoggedIn,isUser, validateReview, wrapAsync(reviewController.createReview));

// delete Review Route

router.delete("/:reviewId",isLoggedIn, isUser ,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;

