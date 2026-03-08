const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const Payment = require("../models/Payment");
const asyncHandler = require("../middleware/asyncHandler");
const config = require("../config/env");
const { bookingSchema, parseSchema } = require("../utils/validation");
const { createError } = require("../utils/http");
const { calculateRentalDays, getTodayUtcDate, toUtcDateOnly, DAY_IN_MS } = require("../utils/date");
const { getActiveBookingFilter, getOverlapFilter } = require("../utils/booking");
const { sendBookingCancellationEmail } = require("../services/emailService");

const createBooking = asyncHandler(async (req, res) => {
  const payload = parseSchema(bookingSchema, req.body);

  const startDate = toUtcDateOnly(payload.startDate);
  const endDate = toUtcDateOnly(payload.endDate);
  if (!startDate || !endDate || endDate < startDate) {
    throw createError("Invalid date range.", 400);
  }

  const today = getTodayUtcDate();
  if (startDate < today) {
    throw createError("Booking start date cannot be in the past.", 400);
  }

  const vehicle = await Vehicle.findById(payload.vehicleId);
  if (!vehicle || !vehicle.isActive) {
    throw createError("Vehicle not found or not available.", 404);
  }

  const conflictingBooking = await Booking.findOne({
    vehicle: vehicle._id,
    ...getActiveBookingFilter(),
    ...getOverlapFilter(startDate, endDate),
  });

  if (conflictingBooking) {
    throw createError("Vehicle is not available for selected dates.", 409);
  }

  const days = calculateRentalDays(startDate, endDate);
  const totalPrice = days * vehicle.pricePerDay;
  const holdExpiresAt = new Date(Date.now() + config.paymentHoldMinutes * 60 * 1000);

  const booking = await Booking.create({
    user: req.user._id,
    vehicle: vehicle._id,
    startDate,
    endDate,
    days,
    totalPrice,
    status: "pending_payment",
    paymentStatus: "pending",
    holdExpiresAt,
  });

  res.status(201).json({
    message: "Booking created. Complete payment to confirm.",
    booking,
    paymentDeadline: holdExpiresAt,
  });
});

const listMyBookings = asyncHandler(async (req, res) => {
  const now = new Date();
  const filter = req.query.filter || "all";

  const query = { user: req.user._id };
  if (filter === "upcoming") {
    query.endDate = { $gte: now };
    query.status = { $ne: "canceled" };
  } else if (filter === "past") {
    query.$or = [{ endDate: { $lt: now } }, { status: "canceled" }];
  }

  const bookings = await Booking.find(query)
    .populate("vehicle")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ bookings });
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("vehicle")
    .populate("user", "firstName lastName email role");

  if (!booking) {
    throw createError("Booking not found.", 404);
  }

  if (req.user.role !== "admin" && booking.user._id.toString() !== req.user._id.toString()) {
    throw createError("Forbidden.", 403);
  }

  res.json({ booking });
});

const listAllBookings = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const status = (req.query.status || "").trim();
  const from = req.query.from ? toUtcDateOnly(req.query.from) : null;
  const to = req.query.to ? toUtcDateOnly(req.query.to) : null;

  const query = {};
  if (status) query.status = status;
  if (from || to) {
    query.startDate = {};
    if (from) query.startDate.$gte = from;
    if (to) query.startDate.$lte = new Date(to.getTime() + DAY_IN_MS - 1);
  }

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate("vehicle")
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(query),
  ]);

  res.json({
    bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("vehicle")
    .populate("user", "firstName email");

  if (!booking) {
    throw createError("Booking not found.", 404);
  }

  const isOwner = booking.user._id.toString() === req.user._id.toString();
  if (req.user.role !== "admin" && !isOwner) {
    throw createError("Forbidden.", 403);
  }

  if (booking.status === "canceled") {
    throw createError("Booking is already canceled.", 400);
  }

  const now = new Date();
  if (req.user.role !== "admin" && now >= booking.startDate) {
    throw createError("You can only cancel before booking start date.", 400);
  }

  booking.status = "canceled";
  booking.canceledAt = now;
  booking.cancellationReason =
    req.body.reason ||
    (req.user.role === "admin" ? "Canceled by admin" : "Canceled by customer");

  if (booking.paymentStatus === "paid") {
    booking.paymentStatus = "refunded";
    await Payment.create({
      booking: booking._id,
      user: booking.user._id,
      vehicle: booking.vehicle._id,
      amount: booking.totalPrice,
      currency: "INR",
      method: "card",
      status: "refunded",
      transactionId: `REF-${Date.now()}-${Math.round(Math.random() * 9999)}`,
      notes: "Auto-refund due to cancellation before trip start.",
    });
  } else {
    booking.paymentStatus = "failed";
  }

  await booking.save();
  await sendBookingCancellationEmail({
    user: booking.user,
    booking,
    vehicle: booking.vehicle,
  });

  res.json({ message: "Booking canceled successfully.", booking });
});

const cleanupExpiredHolds = asyncHandler(async (req, res) => {
  const now = new Date();
  const result = await Booking.updateMany(
    {
      status: "pending_payment",
      holdExpiresAt: { $lte: now },
    },
    {
      $set: {
        status: "canceled",
        paymentStatus: "failed",
        canceledAt: now,
        cancellationReason: "Payment hold expired",
      },
    }
  );

  res.json({
    message: "Expired holds cleaned.",
    modifiedCount: result.modifiedCount,
  });
});

module.exports = {
  createBooking,
  listMyBookings,
  getBookingById,
  listAllBookings,
  cancelBooking,
  cleanupExpiredHolds,
};
