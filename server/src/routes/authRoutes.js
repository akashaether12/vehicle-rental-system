const express = require("express");
const { registerCustomer, loginCustomer, loginAdmin, me } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/admin/login", loginAdmin);
router.get("/me", protect, me);

module.exports = router;
