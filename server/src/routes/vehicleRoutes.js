const express = require("express");
const {
  listVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  checkVehicleAvailability,
} = require("../controllers/vehicleController");
const { protect, optionalProtect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/:id/availability", checkVehicleAvailability);
router.get("/", optionalProtect, listVehicles);
router.get("/:id", getVehicleById);

router.post("/", protect, authorize("admin"), createVehicle);
router.put("/:id", protect, authorize("admin"), updateVehicle);
router.delete("/:id", protect, authorize("admin"), deleteVehicle);

module.exports = router;
