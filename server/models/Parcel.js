const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      unique: true,
      required: true,
      index: true,
      default: function () {
        // Get the current date
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        // Generate a random 4-digit number plus timestamp to ensure uniqueness
        const random = Math.floor(1000 + Math.random() * 9000);
        const timestamp = Date.now().toString().slice(-4);

        // Format: NEP-YYMMDD-XXXX
        return `NEP-${year}${month}${day}-${random}${timestamp}`;
      },
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      name: {
        type: String,
        required: true,
      },
      email: {
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
    pickupAddress: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    packageDetails: {
      weight: {
        type: Number,
        required: true,
      },
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      category: {
        type: String,
        required: true,
      },
      description: String,
    },
    scheduledPickup: {
      date: {
        type: Date,
        required: true,
      },
      timeSlot: {
        type: String,
        required: true,
      },
    },
    deliveryType: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "picked_up", "in_transit", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "online_payment"],
      required: true,
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["pending", "in_transit", "delivered", "cancelled"],
          required: true,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        notes: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add a compound index for better querying
parcelSchema.index({ sender: 1, createdAt: -1 });

const Parcel = mongoose.model("Parcel", parcelSchema);
module.exports = Parcel;
