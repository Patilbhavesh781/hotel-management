const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const hostController = require("../controllers/host.js");
const { route } = require("./listing.js");

router
    .route("/signup")
    .get(hostController.renderSignupFrom)
    // Signup Post Route
    .post(WrapAsync(hostController.signup));


router
    .route("/login")
    .get(hostController.renderLoginFrom)
    .post(saveRedirectUrl, passport.authenticate("host-local",{failureRedirect : "/host/login", failureFlash : true}) , hostController.login);


router.post("/verify-otp",WrapAsync(hostController.otpVerify));

// Logout Route

router.get("/logout", hostController.logout);

module.exports = router;