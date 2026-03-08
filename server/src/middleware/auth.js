const jwt = require("jsonwebtoken");
const config = require("../config/env");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Not authorized. Missing token." });
    }

    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.userId).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User not found or inactive." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

const optionalProtect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      next();
      return;
    }

    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.userId);
    if (user && user.isActive) {
      req.user = user;
    }
    next();
  } catch {
    next();
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: access denied." });
  }
  next();
};

module.exports = { protect, optionalProtect, authorize };
