const express = require("express");
const Store = require("../Models/StroreSchema");
const Rating = require("../Models/RatingSchema");
const { getPagination } = require("../utils/pagination");
const { getSort } = require("../utils/sorting");
const { buildStoreFilter } = require("../utils/filtering");


// Add a new store (Admin only)
// Admin can create stores (and optionally assign owner by userId)
exports.AddnewStore= async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.create({ name, email, address, owner: ownerId || undefined });
    res.status(201).json(store);

    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ message: "Error adding store", error: err.message });
  }
};

// Get all stores (Public)
exports.GetAllStores=async (req, res) => {
  try {
    const stores = await Store.find().populate("ratings");
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stores", error: err.message });
  }
};

// Submit a rating (Normal Users)
exports.SubmitRatingUsers=async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const newRating = new Rating({ user: req.user.id, store: storeId, rating });
    await newRating.save();

    const store = await Store.findById(storeId);
    store.ratings.push(newRating._id);
    await store.save();

    res.status(201).json({ message: "Rating submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error submitting rating", error: err.message });
  }
};


// Get store ratings (Store Owner)
exports.GetStoreRatings= async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Find the store owned by this user
    const store = await Store.findOne({ owner: ownerId });
    if (!store) {
      return res.status(404).json({ message: "No store found for this owner" });
    }

    // Find all ratings for this store (correct field names)
    const ratings = await Rating.find({ store: store._id })
      .populate("user", "name email"); // not userId

    // Calculate average rating
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
        : 0;

    res.json({
      store: store.name,
      averageRating: averageRating.toFixed(1),
      totalRatings: ratings.length,
      ratings,
    });
  } catch (err) {
    console.error("Error fetching ratings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all ratings by logged-in user
exports.GetUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user.id }).populate("store");
    // Return as { storeId: ratingValue }
    const result = {};
    ratings.forEach(r => {
      result[r.store._id] = r.rating;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user ratings", error: err.message });
  }
};

