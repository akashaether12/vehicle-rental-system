const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const { generateToken } = require("../utils/token");
const { authSchemas, parseSchema } = require("../utils/validation");
const { createError } = require("../utils/http");

const registerCustomer = asyncHandler(async (req, res) => {
  const payload = parseSchema(authSchemas.register, req.body);

  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
  if (existingUser) {
    throw createError("An account with this email already exists.", 409);
  }

  const user = await User.create({
    ...payload,
    email: payload.email.toLowerCase(),
    role: "customer",
  });

  const token = generateToken(user);
  res.status(201).json({
    message: "Registration successful.",
    token,
    user: user.toSafeJSON(),
  });
});

const loginByRole = async (payload, expectedRole = null) => {
  const user = await User.findOne({ email: payload.email.toLowerCase() }).select("+password");
  if (!user || !user.isActive) {
    throw createError("Invalid email or password.", 401);
  }

  const isValidPassword = await user.comparePassword(payload.password);
  if (!isValidPassword) {
    throw createError("Invalid email or password.", 401);
  }

  if (expectedRole && user.role !== expectedRole) {
    throw createError("Invalid role login attempt.", 403);
  }

  return user;
};

const loginCustomer = asyncHandler(async (req, res) => {
  const payload = parseSchema(authSchemas.login, req.body);
  const user = await loginByRole(payload, "customer");
  const token = generateToken(user);

  res.json({
    message: "Login successful.",
    token,
    user: user.toSafeJSON(),
  });
});

const loginAdmin = asyncHandler(async (req, res) => {
  const payload = parseSchema(authSchemas.login, req.body);
  const user = await loginByRole(payload, "admin");
  const token = generateToken(user);

  res.json({
    message: "Admin login successful.",
    token,
    user: user.toSafeJSON(),
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

module.exports = { registerCustomer, loginCustomer, loginAdmin, me };
