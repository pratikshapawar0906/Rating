const express = require('express');
const { register, login, forgotPassword } = require('../controllers/UserController');
const router = express.Router();
const { check} = require("express-validator");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");
const {  Admin, stores, adminStoreFiltering, adminUsers, Allstores, SubmitRating, ViewRatingofRatings  } = require('../controllers/adminController');
const { AddnewStore, GetAllStores, SubmitRatingUsers, GetStoreRatings } = require('../controllers/StoreController');


// ******************************************************************************
// user signup and login

// User: user signUp
router.post("/register", [
    check("name", "Name must be between 15 and 60 characters").isLength({ min: 15, max: 60 }),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password must be 8-16 characters, one uppercase & one special char").matches(/^(?=.*[A-Z])(?=.*\W).{8,16}$/),
    
], register)

router.post("/login",[
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
],login)

router.post('/forgot-password', forgotPassword);


// *************************************************************************
// admin panal

// Example: Admin-only route
router.get("/admin/dashboard", authMiddleware, roleMiddleware(["admin"]), Admin);

// Example: Normal User route  // Admin: Add a new store
router.post("/stores", authMiddleware, roleMiddleware(["user", "admin", "storeOwner"]), stores);


// Admin: View all stores with filtering
router.get("/admin/stores", authMiddleware, roleMiddleware(["admin"]), adminStoreFiltering);


// Admin: View all users with filtering
router.get("/admin/users", authMiddleware, roleMiddleware(["admin"]), adminUsers);

// Normal User: View all stores
router.get("/allstores", authMiddleware, roleMiddleware(["user", "admin", "storeOwner"]), Allstores);

// Normal User: Submit a rating
router.post("/stores/:id/rate", authMiddleware, roleMiddleware(["user"]), SubmitRating);


// Store Owner: View ratings for their store
router.get("/store/ratings", authMiddleware, roleMiddleware(["storeOwner"]), ViewRatingofRatings);

//*************************************************************************************
//  store 

// Add a new store (Admin only)
router.post("/", authMiddleware, roleMiddleware(["admin"]), AddnewStore);

// Get all stores (Public)
router.get("/", GetAllStores);

// Submit a rating (Normal Users)
router.post("/rate", authMiddleware, roleMiddleware(["user"]), SubmitRatingUsers);

// Get store ratings (Store Owner)
router.get("stores/:id/ratings", authMiddleware, roleMiddleware(["storeOwner"]), GetStoreRatings);


// ✅ Admin can add a new store
// router.post(
//   "/",
//   authMiddleware(["admin"]),
//   [
//     check("name", "Store name is required").not().isEmpty(),
//     check("address", "Address must be max 400 characters").isLength({ max: 400 }),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//     const { name, address } = req.body;

//     try {
//       const newStore = new Store({ name, address, ratings: [] });
//       await newStore.save();
//       res.status(201).json(newStore);
//     } catch (err) {
//       res.status(500).json({ msg: "Server Error" });
//     }
//   }
// );

// ✅ Get all stores
// router.get("/", async (req, res) => {
//   try {
//     const stores = await Store.find().populate("ratings");
//     res.json(stores);
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// });

// ✅ Search stores by name or address
// router.get("/search", async (req, res) => {
//   const { name, address } = req.query;
//   try {
//     const query = {};
//     if (name) query.name = new RegExp(name, "i");
//     if (address) query.address = new RegExp(address, "i");

//     const stores = await Store.find(query);
//     res.json(stores);
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// });

// ✅ Get store details with ratings (Store Owner)
// router.get("/:storeId", authMiddleware(["store_owner"]), async (req, res) => {
//   try {
//     const store = await Store.findById(req.params.storeId).populate("ratings");
//     if (!store) return res.status(404).json({ msg: "Store not found" });

//     res.json(store);
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// });
  
// ✅ Submit a rating (Normal Users)
// router.post("/rate-store", authMiddleware(["user"]), [
//     check("store", "Store ID is required").not().isEmpty(),
//     check("rating", "Rating must be between 1 and 5").isInt({ min: 1, max: 5 }),
//   ], async (req, res) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
//       const { storeId, rating } = req.body;
//       const existingRating = await Rating.findOne({ user: req.user._id, store: storeId });
  
//       if (existingRating) {
//           existingRating.value = rating;
//           await existingRating.save();
//       } else {
//           await new Rating({ user: req.user._id, store: storeId, value: rating }).save();
//       }
  
//       res.json({ message: "Rating submitted successfully" });
//   });
  


// Fetch user ratings
// router.get("/user/ratings", authMiddleware, async (req, res) => {
//   const ratings = await Rating.find({ user: req.user._id }).select("store value");
//   const ratingMap = {};
//   ratings.forEach((r) => (ratingMap[r.store] = r.value));
//   res.json(ratingMap);
// });

// ✅ Modify user rating
// router.put(
//   "/:ratingId",
//   authMiddleware(["user"]),
//   [
//     check("rating", "Rating must be between 1 and 5").isInt({ min: 1, max: 5 }),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//     try {
//       const rating = await Rating.findById(req.params.ratingId);
//       if (!rating) return res.status(404).json({ msg: "Rating not found" });

//       if (rating.user.toString() !== req.user.id)
//         return res.status(403).json({ msg: "Not authorized" });

//       rating.rating = req.body.rating;
//       await rating.save();

//       res.json(rating);
//     } catch (err) {
//       res.status(500).json({ msg: "Server Error" });
//     }
//   }
// );


// Fetch store ratings for store owner
// router.get("/ratings", authMiddleware, async (req, res) => {
//     try {
//       const store = await Store.findOne({ owner: req.user._id });
  
//       if (!store) {
//         return res.status(404).json({ message: "Store not found" });
//       }
  
//       const ratings = await Rating.find({ store: store._id }).populate("user", "name");
//       const averageRating = ratings.length
//         ? ratings.reduce((acc, rating) => acc + rating.value, 0) / ratings.length
//         : 0;
  
//       res.json({ ratings, averageRating });
//     } catch (error) {
//       res.status(500).json({ message: "Server error" });
//     }
//   });

module.exports = router;