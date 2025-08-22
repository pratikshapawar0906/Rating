const jwt = require("jsonwebtoken");
require("dotenv").config();


const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    // Expect format: Bearer <token>
    const bearer = token.split(" ");
    if (bearer.length !== 2 || bearer[0] !== "Bearer") {
      return res.status(400).json({ message: "Invalid Authorization header format" });
    }

    const decoded = jwt.verify(bearer[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

const roleMiddleware = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access Forbidden" });
  }
  next();
};

module.exports = { authMiddleware, roleMiddleware };