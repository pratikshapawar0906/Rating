const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
  name: { type: String,
     required: true,
     minlength: 2, 
     maxlength: 120, 
     trim: true 
    },
  email: { type: String,
     required: true,
     unique: true,
     lowercase: true,
     trim: true,
     match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
     },
  address: { type: String,
     required: true,
     maxlength: 400,
     default: "" 
   },
  owner: { 
     type: mongoose.Schema.Types.ObjectId,
     ref: "User",
    required: true,
   }, // Store Owner
  ratings: [
    { 
      type: mongoose.Schema.Types.ObjectId,
     ref: "Rating" 
    }
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
});

// helpful for search


// Prevent overwriting the model if it already exists
const Store = mongoose.models.Store || mongoose.model("Store", StoreSchema);


module.exports = Store;