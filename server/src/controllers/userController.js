const { z } = require("zod");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const { createError } = require("../utils/http");

const profileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  licenseNumber: z.string().min(4).optional(),
  licenseExpiry: z.string().optional(),
});

const roleSchema = z.object({
  role: z.enum(["customer", "admin"]),
});

const statusSchema = z.object({
  isActive: z.boolean(),
});

const updateProfile = asyncHandler(async (req, res) => {
  const result = profileSchema.safeParse(req.body);
  if (!result.success) {
    throw createError(result.error.issues?.[0]?.message || "Validation error", 400);
  }

  const updated = await User.findByIdAndUpdate(req.user._id, result.data, {
    new: true,
    runValidators: true,
  });
  res.json({ message: "Profile updated.", user: updated.toSafeJSON() });
});

const listUsers = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const search = (req.query.search || "").trim();
  const role = (req.query.role || "").trim();

  const query = {};
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (role) {
    query.role = role;
  }

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  res.json({
    users: users.map((user) => user.toSafeJSON()),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw createError("User not found.", 404);
  }
  res.json({ user: user.toSafeJSON() });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const result = roleSchema.safeParse(req.body);
  if (!result.success) {
    throw createError(result.error.issues?.[0]?.message || "Validation error", 400);
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw createError("User not found.", 404);
  }

  user.role = result.data.role;
  await user.save();
  res.json({ message: "User role updated.", user: user.toSafeJSON() });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const result = statusSchema.safeParse(req.body);
  if (!result.success) {
    throw createError(result.error.issues?.[0]?.message || "Validation error", 400);
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw createError("User not found.", 404);
  }

  user.isActive = result.data.isActive;
  await user.save();
  res.json({ message: "User status updated.", user: user.toSafeJSON() });
});

module.exports = {
  updateProfile,
  listUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
};
