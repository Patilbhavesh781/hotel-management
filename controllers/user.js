const User = require("../models/user.js");
const nodemailer = require("nodemailer");

let tempUserData = {};


module.exports.renderSignupFrom = (req, res) => {
    res.render("user/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error", "This email is already registered");
            return res.redirect("/user/signup");
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        mailText = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <h2 style="color: #333;">Email Verification - My Booking</h2>
            <p style="font-size: 16px; color: #555;">Hello 👋,</p>
            <p style="font-size: 16px; color: #555;">Thank you for signing up with <b>My Booking</b>. To complete your registration, please use the OTP below to verify your email address:</p>
            <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #5b42f3;">
                ${otp}
            </div>
            <p style="font-size: 14px; color: #888;">This OTP is valid for only 10 minutes. Please do not share it with anyone.</p>
            <p style="font-size: 14px; color: #888;">If you did not request this, you can safely ignore this email.</p>
            <br>
            <p style="font-size: 14px; color: #333;">My Booking Owner, <br><b>Rohit Vadnere</b></p>
            <p style="font-size: 14px; color: #333;">Best regards, <br><b>My Booking Team</b></p>
            </div>
        </div>
        `

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            to: email,
            subject: "Your OTP for Registration",
            html: mailText,
        });

        tempUserData[email] = { username, email, password, otp };

        return res.render("verify-otp", { email, role: "user" });
    }
    catch (err) {
        console.log(err)
        req.flash("error", "User Is Allready Registerd");
        res.redirect("/user/signup");

    }

};

module.exports.otpVerify = async (req, res) => {

    const { email, otp } = req.body;

    if (tempUserData[email] && tempUserData[email].otp == otp) {
        const { username, password } = tempUserData[email];
        const newUser = new User({ email, username });


        const registeredUser = await User.register(newUser, password); // ✅ 
        delete tempUserData[email];

        req.login(registeredUser, (err) => {
            if (err) {
                console.error("Login error:", err);
                return res.json({ success: false, message: "Login failed" });
            }
            req.flash("success", "Welcome Back To My Booking!");
            return res.json({ success: true, redirect: "/listings" });
        });

    } else {
        return res.json({ success: false, message: "Invalid OTP" });
    }
};

module.exports.renderLoginFrom = (req, res) => {
    res.render("user/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back To My Booking!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged Out");
        res.redirect("/listings");
    })
};