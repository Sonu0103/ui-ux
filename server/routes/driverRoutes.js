const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getAssignedParcels,
  updateParcelStatus,
  updateParcelPayment,
  getDeliveryHistory,
} = require("../controllers/driverController");

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo("driver"));

// Driver routes
router.get("/dashboard-stats", getDashboardStats);
router.get("/parcels", getAssignedParcels);
router.patch("/parcels/:id/status", updateParcelStatus);
router.patch("/parcels/:id/payment", updateParcelPayment);
router.get("/delivery-history", getDeliveryHistory);

module.exports = router;
