const Booking = require("../models/Booking");

const getActiveBookingFilter = (referenceDate = new Date()) => ({
  $or: [
    { status: "confirmed" },
    {
      status: "pending_payment",
      holdExpiresAt: { $gt: referenceDate },
    },
  ],
});

const getOverlapFilter = (startDate, endDate) => ({
  startDate: { $lte: endDate },
  endDate: { $gte: startDate },
});

const isVehicleAvailable = async (vehicleId, startDate, endDate, excludeBookingId = null) => {
  const query = {
    vehicle: vehicleId,
    ...getActiveBookingFilter(),
    ...getOverlapFilter(startDate, endDate),
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflict = await Booking.exists(query);
  return !Boolean(conflict);
};

module.exports = { getActiveBookingFilter, getOverlapFilter, isVehicleAvailable };
