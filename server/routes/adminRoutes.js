const express = require("express");
const adminController = require("../controllers/adminController");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(restrictTo("admin"));

router.get("/dashboard-stats", adminController.getDashboardStats);
router.get("/parcels", adminController.getAllParcels);
router.patch("/parcels/:id/status", adminController.updateParcelStatus);
router.patch("/parcels/:id/payment", adminController.updatePaymentStatus);
router.delete("/parcels/:id", adminController.deleteParcel);
router.get("/pricing-plans", adminController.getAllPricingPlans);
router.post("/pricing-plans", adminController.createPricingPlan);
router.patch("/pricing-plans/:id", adminController.updatePricingPlan);
router.delete("/pricing-plans/:id", adminController.deletePricingPlan);
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/status", adminController.updateUserStatus);
router.delete("/users/:id", adminController.deleteUser);
router.post("/assign-parcel", adminController.assignParcelToDriver);
router.get("/drivers", adminController.getDrivers);

module.exports = router;
