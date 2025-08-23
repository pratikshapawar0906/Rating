const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { 
         type: String, 
         required: true,
         minlength: 20,
         maxlength: 60,
         trim: true
        },
  email: { 
     type: String,
     required: true,
     lowercase: true,
     unique: true,
     trim: true,
     match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
    },
  password: { 
     type: String,
     required: true,
      minlength: 8,
       maxlength: 255
    },
  address: { 
    type: String,
      maxlength: 400,
      default: ""
    },
  role: { type: String,
     enum: ["admin", "user", "store_owner"], 
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