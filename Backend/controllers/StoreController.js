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

// // All authenticated users can see stores
// // Also include "myRating" for current user if exists
// exports.listStores = async (req, res) => {
//   const filter = buildStoreFilter(req);
//   const sort = getSort(req, "name");
//   const { limit, skip, page } = getPagination(req);

//   const [items, total] = await Promise.all([
//     Store.find(filter).sort(sort).skip(skip).limit(limit),
//     Store.countDocuments(filter)
//   ]);

//   // Attach my rating (one small extra query per store; fine for small lists; can be optimized)
//   const userId = req.user?._id;
//   let withMine = items;
//   if (userId) {
//     const ids = items.map(s => s._id);
//     const myRatings = await Rating.find({ user: userId, store: { $in: ids } });
//     const map = new Map(myRatings.map(r => [r.store.toString(), r.score]));
//     withMine = items.map(s => ({
//       ...s.toObject(),
//       myRating: map.get(s._id.toString()) || null
//     }));
//   }

//   res.json({
//     page,
//     total,
//     count: withMine.length,
//     items: withMine
//   });
// };

// Get store ratings (Store Owner)
exports.GetStoreRatings= async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate("ratings");
    res.json(store.ratings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching ratings", error: err.message });
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

