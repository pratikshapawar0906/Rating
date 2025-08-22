require('dotenv').config();
const bcrypt= require("bcrypt");
const mongoose= require  ("mongoose");
const { connectDB } =require("./config/db.js");
const User =require("./models/User.js");
const Store=require ("./models/Store.js");

await connectDB();

// Clear existing users and stores
await Promise.all([User.deleteMany({}), Store.deleteMany({})]);

// Create admin
const admin = await User.create({
  name: "Administrator Default Account", // >=20 chars
  email: "admin@example.com",
  address: "HQ, Pune",
  role: "admin", // matches enum
  password: await bcrypt.hash("Admin@123", 10),
});

// Create store owner
const owner = await User.create({
  name: "Default Store Owner Account", // >=20 chars
  email: "owner@example.com",
  address: "Owner Address, Pune",
  role: "store_owner", // matches enum
  password: await bcrypt.hash("Owner@123", 10),
});

// Create stores (both must have owner assigned)
await Store.create([
  {
    name: "Pune Fresh Market",
    email: "pune@fresh.com",
    address: "Shivaji Nagar, Pune",
    owner: owner._id,
  },
  {
    name: "Chakan Electronics",
    email: "contact@chakan-elec.com",
    address: "Chakan, Pune",
    owner: owner._id, // required
  },
]);

console.log(" Seeded admin, owner, and stores.");
await mongoose.disconnect();
process.exit(0);
