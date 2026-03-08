const jwt = require("jsonwebtoken");
const config = require("../config/env");

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

module.exports = { generateToken };
