const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const asyncHandler = require("../middleware/asyncHandler");

const getDashboardReport = asyncHandler(async (req, res) => {
  const today = new Date();

  const [totalUsers, totalVehicles, totalBookings, upcomingBookings, revenueAgg, monthlyRevenue] =
    await Promise.all([
      User.countDocuments({ role: "customer" }),
      Vehicle.countDocuments({ isActive: true }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "confirmed", startDate: { $gte: today } }),
      Payment.aggregate([
        {
          $group: {
            _id: null,
            successRevenue: {
              $sum: {
                $cond: [{ $eq: ["$status", "success"] }, "$amount", 0],
              },
            },
            refundedRevenue: {
              $sum: {
                $cond: [{ $eq: ["$status", "refunded"] }, "$amount", 0],
              },
            },
          },
        },
      ]),
      Payment.aggregate([
        {
          $match: {
            status: "success",
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            total: { $sum: "$amount" },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]),
    ]);

  const revenueSummary = revenueAgg[0] || { successRevenue: 0, refundedRevenue: 0 };
  const totalRevenue = revenueSummary.successRevenue - revenueSummary.refundedRevenue;

  res.json({
    totalUsers,
    totalVehicles,
    totalBookings,
    upcomingBookings,
    totalRevenue,
    monthlyRevenue: monthlyRevenue.map((item) => ({
      label: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      total: item.total,
    })),
  });
});

module.exports = { getDashboardReport };
