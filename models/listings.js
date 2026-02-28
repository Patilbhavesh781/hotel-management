const mongoose = require("mongoose");
const Review = require("./review");
const Schema =  mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  filename: String, // needed for deletion
});


const listingSchema = new Schema({
    title: {
        type : String,
        required:true
    },
    description:String,

    image: [imageSchema],
    
    price:{
        type : Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type : String,
        required : true
    },
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "Host"
    },
    geometry : {
        type : {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates : {
            type: [Number],
            required: true
        },
    },

});

listingSchema.post("findOneAndDelete" , async(listing) => {
    if(listing && listing.reviews) {
        await Review.deleteMany({_id : {$in : listing.reviews}}); 
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;





// image: {
//         type:String,
//         default:"https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//         set: (v) => v === "" ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v
//     },