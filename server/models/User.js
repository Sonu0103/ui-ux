const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const baseUserSchema = {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin", "driver"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  photo: {
    type: String,
    default: null,
  },
};

// Driver-specific schema
const driverSchema = {
  ...baseUserSchema,
  vehicleNumber: {
    type: String,
    required: function () {
      return this.role === "driver";
    },
  },
  vehicleType: {
    type: String,
    enum: ["Motorcycle", "Car", "Van"],
    required: function () {
      return this.role === "driver";
    },
  },
  licenseNumber: {
    type: String,
    required: function () {
      return this.role === "driver";
    },
  },
};

const userSchema = new mongoose.Schema(
  this.role === "driver" ? driverSchema : baseUserSchema
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
