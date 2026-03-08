const express = require("express");
const {
  updateProfile,
  listUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.patch("/me", updateProfile);

router.get("/", authorize("admin"), listUsers);
router.get("/:id", authorize("admin"), getUserById);
router.patch("/:id/role", authorize("admin"), updateUserRole);
router.patch("/:id/status", authorize("admin"), updateUserStatus);

module.exports = router;
