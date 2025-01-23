const User = require("../models/User");
const Parcel = require("../models/Parcel");
const Notification = require("../models/Notification");
const Payment = require("../models/Payment");
const { PARCEL_STATUSES } = require("../models/Parcel");

// Status transition validation
const VALID_TRANSITIONS = {
  pending: ["picked_up"],
  picked_up: ["in_transit"],
  in_transit: ["delivered"],
  delivered: [], // No further transitions allowed
  cancelled: [], // No further transitions allowed
};

exports.getDashboardStats = async (req, res) => {
  try {
    // Get assigned parcels statistics
    const totalAssigned = await Parcel.countDocuments({
      assignedDriver: req.user._id,
    });

    const inTransitParcels = await Parcel.countDocuments({
      assignedDriver: req.user._id,
      status: "in_transit",
    });

    const deliveredParcels = await Parcel.countDocuments({
      assignedDriver: req.user._id,
      status: "delivered",
    });

    const pendingParcels = await Parcel.countDocuments({
      assignedDriver: req.user._id,
      status: "pending",
    });

    // Get today's deliveries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDeliveries = await Parcel.countDocuments({
      assignedDriver: req.user._id,
      status: "delivered",
      updatedAt: { $gte: today },
    });

    // Calculate total earnings
    const completedDeliveries = await Parcel.find({
      assignedDriver: req.user._id,
      status: "delivered",
      paymentStatus: "paid",
    });
    const totalEarnings = completedDeliveries.reduce(
      (sum, parcel) => sum + parcel.amount,
      0
    );

    // Get recent deliveries
    const recentDeliveries = await Parcel.find({
      assignedDriver: req.user._id,
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("sender", "name")
      .select("-__v");

    res.status(200).json({
      status: "success",
      data: {
        totalAssigned,
        inTransitParcels,
        deliveredParcels,
        pendingParcels,
        todayDeliveries,
        totalEarnings,
        recentDeliveries,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getAssignedParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ assignedDriver: req.user._id })
      .sort({ createdAt: -1 })
      .populate("statusHistory.updatedBy", "name");

    res.status(200).json({
      status: "success",
      data: {
        parcels,
      },
    });
  } catch (error) {
    console.error("Get assigned parcels error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updateParcelStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status exists in PARCEL_STATUSES
    if (!PARCEL_STATUSES.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: `Invalid status value. Must be one of: ${PARCEL_STATUSES.join(
          ", "
        )}`,
      });
    }

    // Find parcel and validate existence
    const parcel = await Parcel.findById(id);
    if (!parcel) {
      return res.status(404).json({
        status: "error",
        message: "Parcel not found",
      });
    }

    // Check if driver is assigned to this parcel
    if (
      !parcel.assignedDriver ||
      parcel.assignedDriver.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to update this parcel",
      });
    }

    // Validate status transition
    if (!VALID_TRANSITIONS[parcel.status]?.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: `Invalid status transition from ${parcel.status} to ${status}`,
      });
    }

    // Update parcel
    parcel.status = status;
    parcel.statusHistory.push({
      status,
      updatedBy: req.user._id,
      notes: `Status updated to ${status} by driver`,
      timestamp: new Date(),
    });

    // Save the updated parcel
    const updatedParcel = await parcel.save();

    res.status(200).json({
      status: "success",
      data: {
        parcel: updatedParcel,
      },
    });
  } catch (error) {
    console.error("Update parcel status error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to update parcel status",
    });
  }
};

exports.updateParcelPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const parcel = await Parcel.findById(id);
    if (!parcel) {
      return res.status(404).json({
        status: "error",
        message: "Parcel not found",
      });
    }

    // Check if driver is assigned to this parcel
    if (
      !parcel.assignedDriver ||
      parcel.assignedDriver.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to update this parcel",
      });
    }

    // Validate parcel is delivered
    if (parcel.status !== "delivered") {
      return res.status(400).json({
        status: "error",
        message: "Parcel must be delivered before marking payment as received",
      });
    }

    // Update payment status in parcel
    parcel.paymentStatus = "completed";

    // Add to status history
    parcel.statusHistory.push({
      status: parcel.status,
      updatedBy: req.user._id,
      notes: "Payment collected by driver",
      timestamp: new Date(),
    });

    // Find and update the associated payment record
    const payment = await Payment.findOne({ parcel: parcel._id });
    if (payment) {
      payment.status = "completed";
      payment.collectedBy = req.user._id;
      payment.collectionDate = new Date();
      await payment.save();
    }

    await parcel.save();

    res.status(200).json({
      status: "success",
      data: {
        parcel,
        payment,
      },
    });
  } catch (error) {
    console.error("Update parcel payment error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to update payment status",
    });
  }
};

exports.getDeliveryHistory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { assignedDriver: req.user._id };

    if (startDate && endDate) {
      query.updatedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const deliveries = await Parcel.find(query)
      .sort({ updatedAt: -1 })
      .populate("sender", "name")
      .select("-__v");

    res.status(200).json({
      status: "success",
      data: {
        deliveries,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getPickedParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({
      assignedDriver: req.user._id,
      status: { $in: ["picked_up", "in_transit", "delivered"] },
    })
      .sort({ updatedAt: -1 })
      .populate("sender", "name email")
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
