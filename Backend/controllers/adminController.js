const express =require('express')
const Store = require("../Models/StroreSchema");
const User = require("../Models/UserSchema");
const Rating = require("../Models/RatingSchema");


// Admin: Dashboard Statistics
exports.Admin= async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStores = await Store.countDocuments();
        const totalRatings = await Rating.countDocuments();
    
        res.json({ totalUsers, totalStores, totalRatings });
      } catch (err) {
        res.status(500).json({ message: "Error fetching dashboard data", error: err.message });
      }
};

exports.addUser = async (req, res) => {
  const { name, email, address = "", password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, address, passwordHash, role });
  res.status(201).json({ user: { id: user._id, name, email, role, address } });
};


// admin add a store manually
exports.stores= async (req, res) => {
    try {
        const { name, email, address } = req.body;
        const newStore = new Store({ name, email, address,owner: req.user.id, averageRating: 0 });
        await newStore.save();
        res.status(201).json({ message: "Store added successfully" });
      } catch (err) {
        res.status(500).json({ message: "Error adding store", error: err.message });
      }
};


// Admin: View all stores with filtering
exports.adminStoreFiltering= async (req, res) => {
  try {
    const { name, email, address } = req.query;
    let filters = {};
    if (name) filters.name = { $regex: name, $options: "i" };
    if (email) filters.email = { $regex: email, $options: "i" };
    if (address) filters.address = { $regex: address, $options: "i" };
    

    const stores = await Store.find(filters);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stores", error: err.message });
  }
};

exports.adminUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    let filters = {};
    if (name) filters.name = { $regex: name, $options: "i" };
    if (email) filters.email = { $regex: email, $options: "i" };
    if (address) filters.address = { $regex: address, $options: "i" };
    if (role) filters.role = role;

    const users = await User.find(filters).select("-passwordHash");
    const ownerIds = users.filter(u => u.role === "OWNER").map(u => u._id);

    let ownerRatings = new Map();
    if (ownerIds.length) {
      const stores = await Store.find({ owner: { $in: ownerIds } }).select("owner averageRating");
      ownerRatings = new Map(stores.map(s => [s.owner.toString(), s.averageRating]));
    }

    const enriched = users.map(u => ({
      ...u.toObject(),
      ownerAverageRating: u.role === "OWNER" ? ownerRatings.get(u._id.toString()) ?? 0 : undefined
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};



// Normal User: View all stores
exports.Allstores= async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stores", error: err.message });
  }
};


// Normal User: Submit a rating
exports.SubmitRating=async (req, res) => {
  try {
    const { averageRating } = req.body;
    const storeId = req.params.id;
    const userId = req.user.id;

    if (averageRating < 1 || averageRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const existingRating = await Rating.findOne({ user: userId, store: storeId });

    if (existingRating) {
      existingRating.rating = averageRating;
      await existingRating.save();
      return res.json({ message: "Rating updated successfully" });
    }

    const newRating = new Rating({ user: userId, store: storeId, averageRating });
    await newRating.save();

    // Update store average rating
    const ratings = await Rating.find({ store: storeId });
    const avgRating = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;
    await Store.findByIdAndUpdate(storeId, {averageRating: avgRating });

    res.json({ message: "Rating submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error submitting rating", error: err.message });
  }
};

// Store Owner: View ratings for their store
exports.ViewRatingofRatings = async (req, res) => {
  try {
    const store = await Store.findOne({ email: req.user.email });
    if (!store) return res.status(404).json({ message: "Store not found" });

    const ratings = await Rating.find({ store: store._id }).populate("user", "name email");
    res.json({ store: store.name, ratings });
  } catch (err) {
    res.status(500).json({ message: "Error fetching store ratings", error: err.message });
  }
};


