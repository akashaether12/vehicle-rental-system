const express = require("express");
const { processPayment, listMyPayments, listAllPayments } = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/process", authorize("customer", "admin"), processPayment);
router.get("/my", authorize("customer"), listMyPayments);
router.get("/", authorize("admin"), listAllPayments);

module.exports = router;
