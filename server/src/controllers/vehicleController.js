const { z } = require("zod");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const asyncHandler = require("../middleware/asyncHandler");
const { createError } = require("../utils/http");
const { vehicleSchema, parseSchema } = require("../utils/validation");
const { toUtcDateOnly } = require("../utils/date");
const { getActiveBookingFilter, getOverlapFilter, isVehicleAvailable } = require("../utils/booking");

const listVehicles = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);
  const skip = (page - 1) * limit;

  const search = (req.query.search || "").trim();
  const type = (req.query.type || "").trim();
  const transmission = (req.query.transmission || "").trim();
  const fuelType = (req.query.fuelType || "").trim();
  const sortBy = (req.query.sortBy || "createdAt").trim();
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
  const minPrice = Number(req.query.minPrice);
  const maxPrice = Number(req.query.maxPrice);
  const includeInactive = req.user?.role === "admin" && req.query.includeInactive === "true";

  const query = includeInactive ? {} : { isActive: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { model: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  if (type) query.type = type;
  if (transmission) query.transmission = transmission;
  if (fuelType) query.fuelType = fuelType;
  if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
    query.pricePerDay = {};
    if (!Number.isNaN(minPrice)) query.pricePerDay.$gte = minPrice;
    if (!Number.isNaN(maxPrice)) query.pricePerDay.$lte = maxPrice;
  }

  const startDate = req.query.startDate ? toUtcDateOnly(req.query.startDate) : null;
  const endDate = req.query.endDate ? toUtcDateOnly(req.query.endDate) : null;

  if ((req.query.startDate && !startDate) || (req.query.endDate && !endDate)) {
    throw createError("Invalid startDate or endDate.", 400);
  }

  if (startDate && endDate) {
    if (endDate < startDate) {
      throw createError("endDate must be on or after startDate.", 400);
    }

    const conflictingBookings = await Booking.find(
      {
        ...getActiveBookingFilter(),
        ...getOverlapFilter(startDate, endDate),
      },
      { vehicle: 1 }
    ).lean();

    const blockedVehicleIds = conflictingBookings.map((booking) => booking.vehicle);
    if (blockedVehicleIds.length > 0) {
      query._id = { $nin: blockedVehicleIds };
    }
  }

  const [vehicles, total] = await Promise.all([
    Vehicle.find(query).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit),
    Vehicle.countDocuments(query),
  ]);

  res.json({
    vehicles,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    throw createError("Vehicle not found.", 404);
  }
  res.json({ vehicle });
});

const createVehicle = asyncHandler(async (req, res) => {
  const payload = parseSchema(vehicleSchema, req.body);
  const vehicle = await Vehicle.create(payload);
  res.status(201).json({ message: "Vehicle added successfully.", vehicle });
});

const updateVehicle = asyncHandler(async (req, res) => {
  const partialVehicleSchema = vehicleSchema.partial();
  const parsed = partialVehicleSchema.safeParse(req.body);
  if (!parsed.success) {
    throw createError(parsed.error.issues?.[0]?.message || "Validation error", 400);
  }

  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, parsed.data, {
    new: true,
    runValidators: true,
  });

  if (!vehicle) {
    throw createError("Vehicle not found.", 404);
  }

  res.json({ message: "Vehicle updated.", vehicle });
});

const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    throw createError("Vehicle not found.", 404);
  }

  vehicle.isActive = false;
  await vehicle.save();

  res.json({ message: "Vehicle deleted (soft delete).", vehicle });
});

const checkVehicleAvailability = asyncHandler(async (req, res) => {
  const paramsSchema = z.object({
    startDate: z.string(),
    endDate: z.string(),
  });

  const parsed = paramsSchema.safeParse(req.query);
  if (!parsed.success) {
    throw createError("startDate and endDate are required.", 400);
  }

  const startDate = toUtcDateOnly(parsed.data.startDate);
  const endDate = toUtcDateOnly(parsed.data.endDate);
  if (!startDate || !endDate || endDate < startDate) {
    throw createError("Invalid date range.", 400);
  }

  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle || !vehicle.isActive) {
    throw createError("Vehicle not found or inactive.", 404);
  }

  const available = await isVehicleAvailable(vehicle._id, startDate, endDate);
  res.json({ available, vehicleId: vehicle._id, startDate, endDate });
});

module.exports = {
  listVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  checkVehicleAvailability,
};
