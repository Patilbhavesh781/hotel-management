const Host = require("../models/host.js");
const nodemailer = require("nodemailer");

let tempHostData = {};

module.exports.renderSignupFrom = (req, res) => {
    res.render("host/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        email = (email || "").trim().toLowerCase();
        username = (username || "").trim();

        const existingHost = await Host.findOne({ email });
        if (existingHost) {
            req.flash("error", "This email is already registered");
            return res.redirect("/host/signup");
        }

        const existingUsername = await Host.findOne({ username });
        if (existingUsername) {
            req.flash("error", "This username is already taken");
            return res.redirect("/host/signup");
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        const mailText = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <h2 style="color: #333;">Email Verification - My Booking</h2>
            <p style="font-size: 16px; color: #555;">Hello,</p>
            <p style="font-size: 16px; color: #555;">Thank you for signing up with <b>My Booking</b>. Use the OTP below to verify your email:</p>
            <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #5b42f3;">
                ${otp}
            </div>
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
            from: `"My Booking" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP for Registration",
            html: mailText,
        });

        tempHostData[email] = { username, email, password, otp };

        return res.render("verify-otp", { email, role: "host" });
    } catch (err) {
        console.log(err);
        if (err.code === "EAUTH") {
            req.flash("error", "Email service login failed. Check EMAIL_USER/EMAIL_PASS in .env.");
        } else if (err.code === 11000) {
            req.flash("error", "Email or username already exists.");
        } else if (err.name === "UserExistsError") {
            req.flash("error", err.message);
        } else {
            req.flash("error", err.message || "Signup failed. Please try again.");
        }
        return res.redirect("/host/signup");
    }
};

module.exports.otpVerify = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = (email || "").trim().toLowerCase();

        if (!tempHostData[normalizedEmail] || tempHostData[normalizedEmail].otp != otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        const { username, password } = tempHostData[normalizedEmail];

        if (await Host.findOne({ email: normalizedEmail })) {
            delete tempHostData[normalizedEmail];
            return res.json({ success: false, message: "Email already registered" });
        }

        if (await Host.findOne({ username })) {
            delete tempHostData[normalizedEmail];
            return res.json({ success: false, message: "Username already taken" });
        }

        const newHost = new Host({ email: normalizedEmail, username });
        const registeredHost = await Host.register(newHost, password);
        delete tempHostData[normalizedEmail];

        req.login(registeredHost, (err) => {
            if (err) {
                console.error("Login error:", err);
                return res.json({ success: false, message: "Login failed" });
            }
            req.flash("success", "Welcome Back To My Booking!");
            return res.json({ success: true, redirect: "/listings" });
        });
    } catch (err) {
        console.error("Host OTP verify error:", err);
        return res.json({ success: false, message: err.message || "Signup failed" });
    }
};

module.exports.renderLoginFrom = (req, res) => {
    res.render("host/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back To My Booking!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
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
