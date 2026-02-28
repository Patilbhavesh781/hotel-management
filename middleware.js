const Listing = require("./models/listings");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const cloudinary = require("cloudinary");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create Listing!");
        return res.redirect("/host/login");

    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    if (req.user.email && req.user.email == "rohitvadnere20003@gmail.com") {
        return next();
    }
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the owner of the listings");
        return res.redirect(`/listings/${id}`);
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body, { abortEarly: false });
    if (result.error) {
        const errorMessages = result.error.details.map((err) => err.message).join(", ");
        throw new ExpressError(400, errorMessages);
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body, { abortEarly: false });
    if (result.error) {
        const errorMessages = result.error.details.map((err) => err.message).join(", ");
        throw new ExpressError(400, errorMessages);
    }
    else {
        next();
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    if (req.user.email && req.user.email == "rohitvadnere20003@gmail.com") {
        return next()
    }
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the author of the review");
        return res.redirect(`/listings/${id}`);
    }
    next()

}

module.exports.validateImageCount = async (req, res, next) => {
  if (req.files && req.files.length > 0 && req.files.length !== 5) {
    // Delete all just-uploaded images
    for (let file of req.files) {
      await cloudinary.uploader.destroy(file.filename);
    }

    req.flash("error", "Please upload exactly 5 images.");
    return res.redirect(`/listings/${req.params.id}/edit`);
  }

  next();
};


module.exports.isHost = (req, res, next) => {
    if (req.user.role === 'host' || req.user.email && req.user.email == "rohitvadnere20003@gmail.com") {
        return next();
    }
    req.flash("error", "You Are Not Host");
    res.redirect("/listings");
}

module.exports.isUser = (req, res, next) => {
    let { id } = req.params;
    if (req.user.role === 'user' || req.user.email && req.user.email == "rohitvadnere20003@gmail.com") {
        return next();
    }
    req.flash("error", "You Are Not User");
    res.redirect(`/listings/${id}`);
}