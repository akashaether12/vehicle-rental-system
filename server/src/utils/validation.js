const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

const authSchemas = {
  register: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    licenseNumber: z.string().min(4),
    licenseExpiry: z.string().optional(),
  }),
  login: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
};

const vehicleSchema = z.object({
  name: z.string().min(2),
  brand: z.string().min(2),
  model: z.string().min(1),
  type: z.enum(["sedan", "suv", "hatchback", "luxury", "truck", "van", "bike", "ev", "other"]),
  year: z.number().int().min(1990).max(2100).optional(),
  seats: z.number().int().min(1).max(20).optional(),
  transmission: z.enum(["manual", "automatic"]).optional(),
  fuelType: z.enum(["petrol", "diesel", "electric", "hybrid", "cng", "other"]).optional(),
  location: z.string().min(2),
  pricePerDay: z.number().positive(),
  images: z.array(z.string().url()).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

const bookingSchema = z.object({
  vehicleId: objectIdSchema,
  startDate: z.string(),
  endDate: z.string(),
});

const paymentSchema = z.object({
  bookingId: objectIdSchema,
  method: z.enum(["card", "upi", "netbanking", "cash"]),
  cardNumber: z.string().optional(),
  cardHolderName: z.string().optional(),
  upiId: z.string().optional(),
});

const parseSchema = (schema, payload) => {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const message = result.error.issues?.[0]?.message || "Validation error";
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
  }
  return result.data;
};

module.exports = {
  authSchemas,
  vehicleSchema,
  bookingSchema,
  paymentSchema,
  objectIdSchema,
  parseSchema,
};
