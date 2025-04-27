const express = require("express");
const Store = require("../Models/StroreSchema");
const Rating = require("../Models/RatingSchema");


// Add a new store (Admin only)
exports.AddnewStore= async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const store = new Store({ name, email, address });
    await store.save();
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
    const store = await Store.findById(req.params.id).populate("ratings");
    res.json(store.ratings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching ratings", error: err.message });
  }
};



