if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
};

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Listing = require("./models/listings.js");
const User = require("./models/user.js");
const Host = require("./models/host.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const hostRouter = require("./routes/host.js");
const userRouter = require("./routes/user.js");

// const mongoDbUrl = "mongodb://127.0.0.1:27017/wanderlust";      
const dbUrl = process.env.ATLASDB_URL

main().then(() => {
    console.log("connected to DB");
})
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(dbUrl);     
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

const store = MongoStore.create({
    mongoUrl : dbUrl,              
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};

app.use(session(sessionOption));
app.use(flash());
// app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
passport.use('user-local', new LocalStrategy(User.authenticate()));
passport.use('host-local', new LocalStrategy(Host.authenticate()));

passport.serializeUser((user, done) => {
  done(null, { id: user._id, role: user.role });
});

passport.deserializeUser(async (obj, done) => {
  const Model = obj.role === 'host' ? Host : User;
  try {
    const user = await Model.findById(obj.id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(async (req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
   
     if (req.user && req.user.role == "user") {
        let listing = await User.findById(req.user._id).populate("wishlist");
        res.locals.currUserWishlist = listing.wishlist;
    } else {
        res.locals.currUserWishlist = [];
    }

    next();
})

app.get("/" , async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings , showSearch: true ,  pageScript: "index.js"});
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/host",hostRouter);
app.use("/user",userRouter);



app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Somthing Went Wrong" } = err;
    // console.log(err);
    res.status(statusCode).render("error.ejs", { message });
})

app.listen(8080, () => {
    console.log("server is listening to port 8080");
})

