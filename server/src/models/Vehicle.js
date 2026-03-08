const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["sedan", "suv", "hatchback", "luxury", "truck", "van", "bike", "ev", "other"],
    },
    year: { type: Number, min: 1990, max: 2100 },
    seats: { type: Number, min: 1, max: 20, default: 4 },
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      default: "automatic",
    },
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric", "hybrid", "cng", "other"],
      default: "petrol",
    },
    location: { type: String, trim: true, required: true },
    pricePerDay: { type: Number, required: true, min: 1 },
    images: [{ type: String, trim: true }],
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

vehicleSchema.index({ type: 1, pricePerDay: 1, isActive: 1 });

module.exports = mongoose.model("Vehicle", vehicleSchema);
