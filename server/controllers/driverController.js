const User = require("../models/User");
const Parcel = require("../models/Parcel");
const Notification = require("../models/Notification");
const Payment = require("../models/Payment");

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
    const parcels = await Parcel.find({
      assignedDriver: req.user._id,
      // Include all relevant statuses
      status: { $in: ["pending", "in_transit", "out_for_delivery"] },
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name email")
      .select("-__v");

    console.log("Found parcels:", parcels); // For debugging

    res.status(200).json({
      status: "success",
      results: parcels.length,
      data: {
        parcels,
      },
    });
  } catch (error) {
    console.error("Error in getAssignedParcels:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updateParcelStatus = async (req, res) => {
  try {
    const { parcelId } = req.params;
    const { status } = req.body;

    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
      return res.status(404).json({
        status: "error",
        message: "Parcel not found",
      });
    }

    if (parcel.assignedDriver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this parcel",
      });
    }

    // Update parcel status
    parcel.status = status;
    parcel.statusHistory.push({
      status,
      updatedBy: req.user._id,
      notes: `Status updated to ${status} by driver`,
    });

    await parcel.save();

    // Create notifications
    await Notification.create({
      user: parcel.sender,
      title: "Parcel Status Update",
      message: `Your parcel (${parcel.trackingId}) has been marked as ${status}`,
      type: "parcel_update",
      parcel: parcelId,
    });

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

exports.updateParcelPayment = async (req, res) => {
  try {
    const { parcelId } = req.params;
    const { paymentStatus } = req.body;

    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
      return res.status(404).json({
        status: "error",
        message: "Parcel not found",
      });
    }

    if (parcel.assignedDriver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this parcel",
      });
    }

    if (parcel.status !== "delivered" && paymentStatus === "paid") {
      return res.status(400).json({
        status: "error",
        message: "Parcel must be delivered before marking payment as paid",
      });
    }

    // Update payment status
    parcel.paymentStatus = paymentStatus;

    // Create a payment record
    if (paymentStatus === "paid") {
      await Payment.create({
        parcel: parcelId,
        user: parcel.sender,
        amount: parcel.amount,
        method: parcel.paymentMethod,
        status: "completed",
        collectedBy: req.user._id,
      });
    }

    await parcel.save();

    // Create notifications
    await Promise.all([
      Notification.create({
        user: parcel.sender,
        title: "Payment Status Update",
        message: `Payment for parcel (${parcel.trackingId}) has been marked as ${paymentStatus}`,
        type: "payment_update",
        parcel: parcelId,
      }),
    ]);

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
