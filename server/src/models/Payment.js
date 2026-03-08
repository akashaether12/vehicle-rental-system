const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR", uppercase: true, trim: true },
    method: {
      type: String,
      enum: ["card", "upi", "netbanking", "cash"],
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "failed", "refunded", "pending"],
      required: true,
    },
    transactionId: { type: String, required: true, unique: true, trim: true },
    last4: { type: String, trim: true },
    cardHolderName: { type: String, trim: true },
    notes: { type: String, trim: true },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ booking: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
