const express = require("express");
const driverController = require("../controllers/driverController");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();

// Protect all driver routes
router.use(protect);
router.use(restrictTo("driver"));

router.get("/dashboard-stats", driverController.getDashboardStats);
router.get("/assigned-parcels", driverController.getAssignedParcels);
router.patch("/parcels/:parcelId/status", driverController.updateParcelStatus);
router.get("/delivery-history", driverController.getDeliveryHistory);
router.get("/picked-parcels", driverController.getPickedParcels);
router.patch(
  "/parcels/:parcelId/payment",
  driverController.updateParcelPayment
);

module.exports = router;
