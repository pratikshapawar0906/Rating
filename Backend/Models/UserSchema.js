const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, 
         required: true,
         minlength: 15,
          maxlength: 60 },
  email: { type: String,
     required: true,
      unique: true ,
     match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
   },
  password: { type: String,
     required: true,
      minlength: 8,
       maxlength: 255
    },
  address: { type: String,
     required: true,
      maxlength: 400
    },
  role: { type: String,
     enum: ["admin", "user", "store_owner"], 
     required: true,
     default: "user" 
    },
  store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      default: null, // Only applicable for Store Owners
    },
});

// Prevent overwriting the model if it already exists
const User = mongoose.models.User || mongoose.model("User", UserSchema);


module.exports = User;