const Listing = require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const cloudinary = require("cloudinary");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings, showSearch: true, pageScript: "index.js" });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    else {

        res.render("listings/show.ejs", { listing });
    }
};

module.exports.createListing = async (req, res) => {
    if (req.files.length !== 5) {
        req.flash("error", "Please upload exactly 5 images.");
        return res.redirect("/listings/new");
    }
    
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send();

    const newListing = new Listing(req.body.listing);   //ithe ek object yeto ahe listing ani to direct db madhe save hoto ahe
    newListing.owner = req.user._id;

    newListing.image = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditFrom = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    else {
        res.render("listings/edit.ejs", { listing });
    }
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    // Update basic fields
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
        new: true,
    });

    // Replace images if provided
    if (req.files && req.files.length > 0) {
        for (let img of listing.image) {
            await cloudinary.uploader.destroy(img.filename);
        }

        listing.image = req.files.map((f) => ({
            url: f.path,
            filename: f.filename,
        }));
    }

    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    for (let img of deletedListing.image) {
        await cloudinary.uploader.destroy(img.filename);
    }
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.serachListing = async (req, res) => {
    const query = req.query.query;
    const regex = new RegExp(query, "i");

    const listings = await Listing.find({
        $or: [
            { title: regex },
            { description: regex },
            { location: regex },
            { country: regex }
        ]
    });

    res.render("listings/searchListing", { listings });
}