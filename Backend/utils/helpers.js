const Rating = require("../models/Rating");
const Store = require("../models/Store");

const recalcStoreAverage = async (storeId) => {
  const ratings = await Rating.find({ store: storeId });
  const avg = ratings.length ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length : 0;
  await Store.findByIdAndUpdate(storeId, { averageRating: Math.round(avg * 10) / 10 });
};

module.exports = { recalcStoreAverage };
