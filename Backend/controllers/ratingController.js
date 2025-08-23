const Rating = require ("../Models/RatingSchema.js");
const Store =require ("../Models/StroreSchema.js");

exports.recalcStoreAverage = async (storeId) => {
  const agg = await Rating.aggregate([
    { $match: { store: storeId } },
    { $group: { _id: "$store", avg: { $avg: "$score" }, count: { $sum: 1 } } }
  ]);
  const { avg = 0, count = 0 } = agg[0] || {};
  await Store.findByIdAndUpdate(storeId, {
    averageRating: Math.round(avg * 10) / 10,
    ratingCount: count
  });
};

exports.upsertMyRating = async (req, res) => {
  const { storeId, score } = req.body;
  const userId = req.user._id;

  const store = await Store.findById(storeId);
  if (!store) return res.status(404).json({ message: "Store not found" });

  const rating = await Rating.findOneAndUpdate(
    { store: storeId, user: userId },
    { $set: { score } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await recalcStoreAverage(storeId);
  res.status(201).json({ message: "Rating saved", rating });
};

// For owners: who rated my store
exports.listRatersForMyStore = async (req, res) => {
  const { storeId } = req.params;
  const store = await Store.findById(storeId).populate("owner", "_id");
  if (!store) return res.status(404).json({ message: "Store not found" });

  const isOwner = store.owner && store.owner._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "ADMIN";
  if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });

  const ratings = await Rating.find({ store: storeId })
    .populate("user", "name email address")
    .sort({ createdAt: -1 });

  res.json({
    store: { id: store._id, name: store.name, averageRating: store.averageRating, ratingCount: store.ratingCount },
    ratings
  });
};
