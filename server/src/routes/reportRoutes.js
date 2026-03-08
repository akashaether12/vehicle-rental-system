const express = require("express");
const { getDashboardReport } = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", protect, authorize("admin"), getDashboardReport);

module.exports = router;
