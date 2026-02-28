const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner : "684a693e5910aeb098972bbf",
    }));
    console.log(initData.data);
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDb();