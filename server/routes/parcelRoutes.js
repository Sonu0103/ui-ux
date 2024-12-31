const express = require("express");
const parcelController = require("../controllers/parcelController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/track/:trackingId", parcelController.trackParcel);

router.use(protect);

router.post("/", parcelController.createParcel);
router.get("/", parcelController.getUserParcels);
router.get("/dashboard-stats", parcelController.getDashboardStats);
router.get("/payment-history", parcelController.getPaymentHistory);
router.get("/:id", parcelController.getParcelById);
router.patch("/:id/confirm-payment", parcelController.confirmParcelPayment);

module.exports = router;
