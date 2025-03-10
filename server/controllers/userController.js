const User = require("../models/User");
const Parcel = require("../models/Parcel");
const PricingPlan = require("../models/PricingPlan");
const Payment = require("../models/Payment");

exports.getDashboardStats = async (req, res) => {
  try {
    // Get user's parcels statistics
    const totalParcels = await Parcel.countDocuments({ sender: req.user._id });
    const inTransitParcels = await Parcel.countDocuments({
      sender: req.user._id,
      status: "in_transit",
    });
    const deliveredParcels = await Parcel.countDocuments({
      sender: req.user._id,
      status: "delivered",
    });
    const pendingParcels = await Parcel.countDocuments({
      sender: req.user._id,
      status: "pending",
    });

    // Calculate total spending
    const userParcels = await Parcel.find({ sender: req.user._id });
    const totalSpending = userParcels.reduce(
      (sum, parcel) => sum + parcel.amount,
      0
    );

    // Get recent parcels
    const recentParcels = await Parcel.find({ sender: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("receiver", "name")
      .populate("assignedDriver", "name");

    res.status(200).json({
      status: "success",
      data: {
        totalParcels,
        inTransitParcels,
        deliveredParcels,
        pendingParcels,
        totalSpending,
        recentParcels,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getUserParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ sender: req.user._id })
      .sort({ createdAt: -1 })
      .populate("assignedDriver", "name")
      .select("-__v");

    res.status(200).json({
      status: "success",
      data: {
        parcels,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.calculateParcelCost = async (req, res) => {
  try {
    const { weight, deliveryType } = req.body;

    // Find the appropriate pricing plan based on weight
    const pricingPlan = await PricingPlan.findOne({
      isActive: true,
      maxWeight: { $gte: parseFloat(weight) },
    }).sort({ maxWeight: 1 });

    if (!pricingPlan) {
      return res.status(400).json({
        status: "error",
        message: "No suitable pricing plan found for this weight",
      });
    }

    // Calculate base price from pricing plan
    let totalCost = pricingPlan.price;

    // Apply delivery type multiplier
    if (deliveryType === "express") {
      totalCost *= 1.5; // 50% more for express delivery
    }

    // Round to 2 decimal places
    totalCost = Math.round(totalCost * 100) / 100;

    res.status(200).json({
      status: "success",
      data: {
        amount: totalCost,
        pricingPlan: {
          name: pricingPlan.name,
          deliveryTime: pricingPlan.deliveryTime,
          features: pricingPlan.features,
          basePrice: pricingPlan.price,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.createParcel = async (req, res) => {
  try {
    // Create new parcel with sender set to current user
    const parcelData = {
      ...req.body,
      sender: req.user._id,
      status: "pending",
      paymentStatus: "pending",
    };

    // Create the parcel - trackingId will be generated automatically
    const parcel = await Parcel.create(parcelData);

    // Verify tracking ID was generated
    if (!parcel.trackingId) {
      throw new Error("Failed to generate tracking ID");
    }

    // Create payment record
    const payment = await Payment.create({
      parcel: parcel._id,
      user: req.user._id,
      amount: req.body.amount,
      method: req.body.paymentMethod || "cash_on_delivery",
      status: "pending",
    });

    // Add payment reference to parcel
    parcel.payment = payment._id;
    parcel.paymentStatus = "pending";
    parcel.amount = req.body.amount;
    await parcel.save();

    res.status(201).json({
      status: "success",
      data: {
        parcel,
        payment,
      },
    });
  } catch (error) {
    console.error("Create parcel error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to create parcel",
    });
  }
};

exports.getParcelById = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id)
      .populate("assignedDriver", "name")
      .select("-__v");

    if (!parcel) {
      return res.status(404).json({
        status: "error",
        message: "Parcel not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        parcel,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getMyParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ sender: req.user._id })
      .sort({ createdAt: -1 })
      .populate("assignedDriver", "name")
      .select("-__v");

    res.status(200).json({
      status: "success",
      data: {
        parcels,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.trackParcel = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const parcel = await Parcel.findOne({ trackingId })
      .populate("sender", "name")
      .populate("assignedDriver", "name")
      .select("-__v");

    if (!parcel) {
      return res.status(404).json({
        status: "error",
        message: "No parcel found with this tracking ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        parcel,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    // Find all payments for the user, regardless of status
    const payments = await Payment.find({ user: req.user._id })
      .select("amount method status createdAt updatedAt transactionId")
      .populate({
        path: "parcel",
        select:
          "trackingId receiver deliveryAddress status amount paymentMethod createdAt",
        populate: [
          {
            path: "assignedDriver",
            select: "name",
          },
          {
            path: "sender",
            select: "name email",
          },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();

    // Always return an array, even if empty
    const paymentsList = payments || [];

    // Calculate statistics including all transactions
    const stats = {
      totalAmount: paymentsList.reduce(
        (sum, payment) => sum + (payment.amount || 0),
        0
      ),
      totalPayments: paymentsList.length,
      pendingAmount: paymentsList
        .filter((payment) => payment.status === "pending")
        .reduce((sum, payment) => sum + (payment.amount || 0), 0),
      completedAmount: paymentsList
        .filter((payment) => payment.status === "completed")
        .reduce((sum, payment) => sum + (payment.amount || 0), 0),
      pendingCount: paymentsList.filter(
        (payment) => payment.status === "pending"
      ).length,
      completedCount: paymentsList.filter(
        (payment) => payment.status === "completed"
      ).length,
    };

    // Log for debugging
    console.log("Found payments:", paymentsList.length);
    console.log("Stats:", stats);

    res.status(200).json({
      status: "success",
      data: {
        payments: paymentsList,
        stats,
      },
    });
  } catch (error) {
    console.error("Payment History Error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch payment history. " + error.message,
    });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { parcelId, method, amount } = req.body;

    const payment = await Payment.create({
      parcel: parcelId,
      user: req.user._id,
      amount,
      method,
      status: method === "online_payment" ? "pending" : "completed",
      transactionId:
        method === "online_payment" ? `TXN${Date.now()}` : undefined,
    });

    res.status(201).json({
      status: "success",
      data: {
        payment,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
