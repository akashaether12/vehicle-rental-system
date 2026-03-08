const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const asyncHandler = require("../middleware/asyncHandler");
const { paymentSchema, parseSchema } = require("../utils/validation");
const { createError } = require("../utils/http");
const { sendBookingConfirmationEmail } = require("../services/emailService");

const generateTransactionId = () => {
  return `TXN-${Date.now()}-${Math.round(Math.random() * 1000000)}`;
};

const processPayment = asyncHandler(async (req, res) => {
  const payload = parseSchema(paymentSchema, req.body);
  const booking = await Booking.findById(payload.bookingId)
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
    throw createError("Booking is canceled and cannot be paid.", 400);
  }

  if (booking.status === "confirmed" && booking.paymentStatus === "paid") {
    throw createError("Booking is already paid and confirmed.", 400);
  }

  if (booking.holdExpiresAt && booking.holdExpiresAt <= new Date()) {
    booking.status = "canceled";
    booking.paymentStatus = "failed";
    booking.canceledAt = new Date();
    booking.cancellationReason = "Payment hold expired";
    await booking.save();
    throw createError("Payment window expired. Please create a new booking.", 410);
  }

  if (payload.method === "card" && (!payload.cardNumber || payload.cardNumber.length < 12)) {
    throw createError("Invalid card details.", 400);
  }

  if (payload.method === "upi" && !payload.upiId) {
    throw createError("UPI ID is required for UPI payments.", 400);
  }

  let status = "success";
  let failureReason = "";
  if (payload.method === "card" && payload.cardNumber.endsWith("0")) {
    status = "failed";
    failureReason = "Card authorization failed in payment gateway simulation.";
  }

  const payment = await Payment.create({
    booking: booking._id,
    user: booking.user._id,
    vehicle: booking.vehicle._id,
    amount: booking.totalPrice,
    currency: "INR",
    method: payload.method,
    status,
    transactionId: generateTransactionId(),
    last4: payload.cardNumber ? payload.cardNumber.slice(-4) : "",
    cardHolderName: payload.cardHolderName || "",
    notes: failureReason,
  });

  if (status === "success") {
    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    booking.holdExpiresAt = null;
    await booking.save();

    await sendBookingConfirmationEmail({
      user: booking.user,
      booking,
      vehicle: booking.vehicle,
      payment,
    });

    res.status(201).json({
      message: "Payment successful. Booking confirmed.",
      payment,
      booking,
    });
    return;
  }

  booking.paymentStatus = "failed";
  await booking.save();

  res.status(400).json({
    message: "Payment failed in simulation. Try another method/card.",
    payment,
    booking,
  });
});

const listMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id })
    .populate("vehicle")
    .populate("booking")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ payments });
});

const listAllPayments = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const status = (req.query.status || "").trim();
  const method = (req.query.method || "").trim();

  const query = {};
  if (status) query.status = status;
  if (method) query.method = method;

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate("user", "firstName lastName email")
      .populate("vehicle", "brand model type")
      .populate("booking", "startDate endDate status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Payment.countDocuments(query),
  ]);

  res.json({
    payments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

module.exports = { processPayment, listMyPayments, listAllPayments };
