const express = require("express");
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Protected routes
router.use(protect);
router.get("/profile", authController.getProfile);
router.patch("/profile", authController.updateProfile);
router.post("/profile/photo", protect, authController.uploadProfilePhoto);

module.exports = router;
