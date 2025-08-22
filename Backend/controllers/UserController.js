const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {  validationResult } = require("express-validator");
const User = require("../Models/UserSchema");
const { sendResetEmail } = require('../controllers/emailService');


const signToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

// User Registration
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array()  // Return all validation errors
    });
  }

  const { name, email, password, address, role } = req.body;
  console.log("Received request:", req.body); // Debugging

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   user = new User({ name, email, password: hashedPassword, address, role });
    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).send("Server Error");
  }
};


// User Login
exports.login= async (req, res) => {

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    console.error("login:", err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "15m" }
); // simple for now, ideally use JWT or random token

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    await sendResetEmail(email, resetLink);

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  const ok = await bcrypt.compare(oldPassword, user.password); // ✅ use 'password'
  if (!ok) return res.status(400).json({ message: "Old password incorrect" });

  user.password = await bcrypt.hash(newPassword, 10); // ✅ use 'password'
  await user.save();
  res.json({ message: "Password updated" });
};


exports.logout = async (req, res) => {
  try {
    // If JWT-based, just instruct frontend to delete token
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error logging out", error: err.message });
  }
};
