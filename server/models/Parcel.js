const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parcelId: {
    type: String,
    unique: true,
  },
  trackingId: {
    type: String,
    unique: true,
  },
  senderDetails: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  receiverDetails: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  parcelDetails: {
    weight: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    description: String,
    specialInstructions: String,
  },
  paymentDetails: {
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["COD"],
      default: "COD",
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  status: {
    type: String,
    enum: ["pending", "processing", "in_transit", "delivered", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate IDs before validation
parcelSchema.pre("validate", function (next) {
  if (!this.parcelId) {
    this.parcelId =
      "NEP" + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  if (!this.trackingId) {
    this.trackingId = this.parcelId;
  }
  next();
});

// Update the timestamp before saving
parcelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Parcel = mongoose.model("Parcel", parcelSchema);
module.exports = Parcel;
