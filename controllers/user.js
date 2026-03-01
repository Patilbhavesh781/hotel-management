const User = require("../models/user.js");
const PendingSignup = require("../models/pendingSignup.js");
const nodemailer = require("nodemailer");

module.exports.renderSignupFrom = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    email = (email || "").trim().toLowerCase();
    username = (username || "").trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "This email is already registered");
      return res.redirect("/user/signup");
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      req.flash("error", "This username is already taken");
      return res.redirect("/user/signup");
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const mailText = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <h2 style="color: #333;">Email Verification - My Booking</h2>
          <p style="font-size: 16px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">Thank you for signing up with <b>My Booking</b>. Use the OTP below to verify your email:</p>
          <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #5b42f3;">${otp}</div>
          <p style="font-size: 14px; color: #888;">This OTP is valid for 10 minutes.</p>
        </div>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: (process.env.EMAIL_PASS || "").replace(/\s+/g, ""),
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Your OTP for Registration",
      html: mailText,
    });

    await PendingSignup.findOneAndUpdate(
      { email, role: "user" },
      {
        $set: {
          username,
          password,
          otp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.render("verify-otp", { email, role: "user" });
  } catch (err) {
    console.log(err);
    if (err.code === "EAUTH") {
      req.flash("error", "Email service login failed. Check EMAIL_USER/EMAIL_PASS in .env.");
    } else {
      req.flash("error", err.message || "Signup failed. Please try again.");
    }
    return res.redirect("/user/signup");
  }
};

module.exports.otpVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    const pending = await PendingSignup.findOne({ email: normalizedEmail, role: "user" });
    if (!pending) {
      return res.json({ success: false, message: "OTP expired. Please sign up again." });
    }

    if (pending.expiresAt < new Date()) {
      await PendingSignup.deleteOne({ _id: pending._id });
      return res.json({ success: false, message: "OTP expired. Please sign up again." });
    }

    if (pending.otp !== String(otp)) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (await User.findOne({ email: normalizedEmail })) {
      await PendingSignup.deleteOne({ _id: pending._id });
      return res.json({ success: false, message: "Email already registered" });
    }

    if (await User.findOne({ username: pending.username })) {
      await PendingSignup.deleteOne({ _id: pending._id });
      return res.json({ success: false, message: "Username already taken" });
    }

    const newUser = new User({ email: normalizedEmail, username: pending.username });
    const registeredUser = await User.register(newUser, pending.password);
    await PendingSignup.deleteOne({ _id: pending._id });

    req.login(registeredUser, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.json({ success: false, message: "Login failed" });
      }
      req.flash("success", "Welcome Back To My Booking!");
      return res.json({ success: true, redirect: "/listings" });
    });
  } catch (err) {
    console.error("User OTP verify error:", err);
    return res.json({ success: false, message: err.message || "Signup failed" });
  }
};

module.exports.renderLoginFrom = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome Back To My Booking!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Logged Out");
    res.redirect("/listings");
  });
};
