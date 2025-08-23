const express = require("express");
const Store = require("../Models/StroreSchema");
const Rating = require("../Models/RatingSchema");



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
    if (rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be 1-5" });

    const existing = await Rating.findOne({ user: req.user._id, store: storeId });
    if (existing) {
      existing.rating = rating;
      await existing.save();
    } else {
      await Rating.create({ user: req.user._id, store: storeId, rating });
    }

    await recalcStoreAverage(storeId);
    res.json({ message: "Rating submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error submitting rating", error: err.message });
  }
};


// Get store ratings (Store Owner)
exports.GetStoreRatings= async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return res.status(404).json({ message: "Store not found" });

    const ratings = await Rating.find({ store: store._id }).populate("user", "name email");
    res.json({ store: store.name, averageRating: store.averageRating, ratings });
  } catch (err) {
    res.status(500).json({ message: "Error fetching ratings", error: err.message });
  }
};


