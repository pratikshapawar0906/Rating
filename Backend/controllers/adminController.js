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

exports.stores= async (req, res) => {
    try {
        const { name, email, address, owner } = req.body;
        const newStore = new Store({ name, email, address,owner, averageRating: 0 });
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

// Admin: View all users with filtering
exports.adminUsers= async (req, res) => {
  try {
    const { name, email, address,role } = req.query;
    let filters = {};
    if (name) filters.name = { $regex: name, $options: "i" };
    if (email) filters.email = { $regex: email, $options: "i" };
    if (address) filters.address = { $regex: address, $options: "i" };
    if (role) filters.role = role;

    const users = await User.find(filters);
    res.json(users);
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
    const { rating } = req.body;
    const storeId = req.params.id;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const existingRating = await Rating.findOne({ user: userId, store: storeId });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.json({ message: "Rating updated successfully" });
    }

    const newRating = new Rating({ user: userId, store: storeId, rating });
    await newRating.save();

    // Update store average rating
    const ratings = await Rating.find({ store: storeId });
    const avgRating = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;
    await Store.findByIdAndUpdate(storeId, { rating: avgRating });

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


