const express = require('express');
const { register, login, forgotPassword, changePassword, logout, getprofile, Updateprofile } = require('../controllers/UserController');
const router = express.Router();
const { check} = require("express-validator");
const { authMiddleware, roleMiddleware } = require("../Middleware/authMiddleware");
const {  Admin, stores, adminStoreFiltering, adminUsers, Allstores, SubmitRating, ViewRatingofRatings, addUser  } = require('../controllers/adminController');
const { AddnewStore, GetAllStores, SubmitRatingUsers, GetStoreRatings } = require('../controllers/StoreController');
const { signupValidator, loginValidator, changePasswordValidator, ratingValidator, listQueryValidator, createStoreValidator } = require('../utils/validators');
const { validate } = require('../Models/UserSchema');
const { upsertMyRating, listRatersForMyStore } = require('../controllers/ratingController');
const validateRequest = require('../Middleware/validate');


// ******************************************************************************
// user signup and login

// User: user signUp
router.post("/register",signupValidator,validateRequest, register)

//login
router.post("/login",loginValidator,validateRequest,login)

//change password
router.post("/change-password", authMiddleware, changePasswordValidator, validateRequest, changePassword);

router.post('/forgot-password', forgotPassword);

//logout
router.post("/logout",authMiddleware, logout)

router.get("/profile",authMiddleware,getprofile);

router.put("/update-profile",authMiddleware,Updateprofile);


// *************************************************************************

//rating panel

router.post("/rating", authMiddleware, roleMiddleware("USER", "ADMIN", "OWNER"), ratingValidator, validateRequest, upsertMyRating);

// For owners: who rated my store
router.get("/store/:storeId", authMiddleware, listQueryValidator, validateRequest, listRatersForMyStore);









//************************************************************************************************* */
// admin panal

// Example: Admin-only route
router.get("/admin/dashboard", authMiddleware, roleMiddleware(["admin"]), Admin);


// admin can add users
router.post("/admin/adduser",authMiddleware,addUser)

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

// Add a new store (Admin only) // Admin creates stores
router.post("/stores/newstores", authMiddleware, roleMiddleware(["admin"]),createStoreValidator, validateRequest, AddnewStore);

// Get all stores (Public)
router.get("/stores/allstores", GetAllStores);

// Submit a rating (Normal Users)
router.post("/rate", authMiddleware, roleMiddleware(["user"]), SubmitRatingUsers);

// Get store ratings (Store Owner)
router.get("/stores/ratings", authMiddleware, roleMiddleware(["store_owner"]), GetStoreRatings);






module.exports = router;