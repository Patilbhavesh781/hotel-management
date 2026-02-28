const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

router
    .route("/signup")
    .get(userController.renderSignupFrom)
    // Signup Post Route
    .post(WrapAsync(userController.signup));


router
    .route("/login")
    .get(userController.renderLoginFrom)
    .post(saveRedirectUrl, passport.authenticate("user-local",{failureRedirect : "/user/login", failureFlash : true}) , userController.login);

router.post("/verify-otp",WrapAsync(userController.otpVerify));

// Logout Route

router.get("/logout", userController.logout);

module.exports = router;