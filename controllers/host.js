const Host = require("../models/host.js");
const nodemailer = require("nodemailer");

let tempHostData = {};

module.exports.renderSignupFrom = (req, res) => {
    res.render("host/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        const existingHost = await Host.findOne({ email });
        if (existingHost) {
            req.flash("error", "This email is already registered");
            return res.redirect("/host/signup");
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
            from: '"My Booking " <rohitvadnere20003@gmail.com>',
            to: email,
            subject: "Your OTP for Registration",
            html: mailText,
        });

        tempHostData[email] = { username, email, password, otp };

        return res.render("verify-otp", { email, role: "host" });
    }
    catch (err) {
        console.log(err)
        req.flash("error", "Host Is Allready Registerd");
        res.redirect("/host/signup");

    }

};

module.exports.otpVerify = async (req, res) => {

    const { email, otp } = req.body;

    if (tempHostData[email] && tempHostData[email].otp == otp) {
        const { username, password } = tempHostData[email];
        const newHost = new Host({ email, username });


        const registeredHost = await Host.register(newHost, password);
        delete tempHostData[email];

        req.login(registeredHost, (err) => {
            if (err) {
                console.error("Login error:", err);
                return res.json({ success: false});
            }
            req.flash("success", "Welcome Back To My Booking!");
            return res.json({ success: true, redirect: "/listings" });
        });

    } else {
        return res.json({ success: false, message: "Invalid OTP" });
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

module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged Out");
        res.redirect("/listings");
    })
};