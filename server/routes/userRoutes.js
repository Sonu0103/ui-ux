const express = require("express");
const userController = require("../controllers/userController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect); // Protect all user routes

router.get("/dashboard-stats", userController.getDashboardStats);
router.get("/parcels", userController.getUserParcels);
router.post("/parcels/calculate-cost", userController.calculateParcelCost);
router.post("/parcels", userController.createParcel);
router.get("/parcels/:id", userController.getParcelById);
router.get("/my-parcels", userController.getMyParcels);
router.get("/track/:trackingId", userController.trackParcel);
router.get("/payments", userController.getPaymentHistory);
router.post("/payments", userController.createPayment);

module.exports = router;
