const express = require("express");
const {
  createBooking,
  listMyBookings,
  getBookingById,
  listAllBookings,
  cancelBooking,
  cleanupExpiredHolds,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", authorize("customer"), createBooking);
router.get("/my", authorize("customer"), listMyBookings);
router.get("/", authorize("admin"), listAllBookings);
router.post("/cleanup-expired-holds", authorize("admin"), cleanupExpiredHolds);
router.get("/:id", getBookingById);
router.patch("/:id/cancel", cancelBooking);

module.exports = router;
