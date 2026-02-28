const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const hostSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique: true
    },
    role : {
        type : String,
        default : "host"
    }
});

hostSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Host", hostSchema);