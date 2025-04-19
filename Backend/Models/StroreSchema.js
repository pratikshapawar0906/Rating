const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
  name: { type: String,
     required: true 
    },
  email: { type: String,
     required: true,
     unique: true,
     match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
     },
  address: { type: String,
     required: true,
    maxlength: 400,
   },
  owner: { type: mongoose.Schema.Types.ObjectId,
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



// Prevent overwriting the model if it already exists
const Store = mongoose.models.Store || mongoose.model("Store", StoreSchema);


module.exports = Store;