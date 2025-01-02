const mongoose = require("mongoose");

const pricingPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    deliveryTime: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: [
      {
        type: String,
        required: true,
      },
    ],
    maxWeight: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PricingPlan = mongoose.model("PricingPlan", pricingPlanSchema);
module.exports = PricingPlan;
