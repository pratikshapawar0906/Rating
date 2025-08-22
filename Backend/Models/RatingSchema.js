const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId,
     ref: "User",
      required: true
     },
  store: { type: mongoose.Schema.Types.ObjectId,
     ref: "Store",
      required: true },
  rating: { 
      type: Number,
      required: true,
      min: 1,
      max: 5 
    },
  createdAt: { type: Date, default: Date.now }
});


// Prevent overwriting the model if it already exists
const Rating= mongoose.models.Rating || mongoose.model("Rating", RatingSchema);


module.exports = Rating;
