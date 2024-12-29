const User = require("../models/User");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `user-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload only images."), false);
    }
  },
});

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
    });

    // Generate token
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(201).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email and password",
      });
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: "error",
        message: "Incorrect email or password",
      });
    }

    // Check if role matches
    if (user.role !== role) {
      return res.status(401).json({
        status: "error",
        message: "Invalid role for this user",
      });
    }

    // Generate token
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log("=== Update Profile Request Started ===");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("User:", req.user);

    const { name, email, phone, address } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      console.log("Validation failed - missing required fields");
      return res.status(400).json({
        status: "error",
        message: "Name, email, and phone are required fields",
      });
    }

    // Check if email already exists
    if (email !== req.user.email) {
      console.log("Checking for existing email:", email);
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("Email already exists");
        return res.status(400).json({
          status: "error",
          message: "Email already exists",
        });
      }
    }

    console.log("Updating user with ID:", req.user._id);
    console.log("Update data:", { name, email, phone, address });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone, address },
      { new: true }
    );

    if (!updatedUser) {
      console.log("User not found for update");
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    console.log("User updated successfully:", updatedUser);

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("=== Update Profile Error ===");
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    res.status(400).json({
      status: "error",
      message: error.message || "Failed to update profile",
    });
  }
};

exports.uploadProfilePhoto = [
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "Please upload a file",
        });
      }

      const photoPath = `/uploads/profiles/${req.file.filename}`;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { photo: photoPath },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      console.error("Photo upload error:", error);
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },
];
