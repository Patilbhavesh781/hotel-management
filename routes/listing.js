const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/WrapAsync.js")
const { isLoggedIn , isOwner , validateListing, isHost, isUser, validateImageCount } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});

const listingController = require("../controllers/listing.js");

router
    .route("/")
    // Index Route
    .get(wrapAsync(listingController.index))
    // Create Route
    .post(isLoggedIn , isHost ,upload.array("listing[image]", 5), validateListing, wrapAsync(listingController.createListing));

// show wishlist

router.get("/wishlist",isLoggedIn, isUser, wrapAsync(async (req,res) => {
    let id = req.user._id;
    let allListings = await User.findById(id).populate("wishlist");
    res.render("listings/wishlist.ejs", { allListings });
}));

// website owner

router.get("/web-owner",(req,res) => {
    res.render("listings/web-owner.ejs");
})

// wishlist added in user collection

router.post("/wishlist/:id",isLoggedIn,isUser, wrapAsync(async (req,res) => {
    let id = req.params.id;
    let userId = req.user._id;
    let user = await User.findById(userId);
    if (!user.wishlist.includes(id)) {
        user.wishlist.push(id);
    }
    await user.save();
    res.json({ success: true, redirectTo: "/listings/wishlist" });
}));

// wishlist is delete in user collection

router.delete("/wishlist/:id" ,isLoggedIn, isUser, wrapAsync(async (req,res) => {
    const userId = req.user._id;
    const listingId = req.params.id;
    try {
        await User.findByIdAndUpdate(userId, {$pull: { wishlist: listingId }});
        res.json({ success: true, redirectTo: "/listings/wishlist" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
}))

// New Route
router.get("/new", isLoggedIn, isHost, listingController.renderNewForm);

router.get("/search", wrapAsync(listingController.serachListing));

router
    .route("/:id")
    // Show Route
    .get(wrapAsync(listingController.showListing))
    // Update Route
    .put(isLoggedIn, isHost, isOwner,upload.array("listing[image]",5),validateImageCount, validateListing, wrapAsync(listingController.updateListing))
    // Delete Route
    .delete(isLoggedIn, isHost, isOwner, wrapAsync(listingController.destroyListing));


//Edit Route



router.get("/:id/edit", isLoggedIn, isHost, isOwner, wrapAsync(listingController.renderEditFrom));


module.exports = router;
