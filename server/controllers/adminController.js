const User = require("../models/User");
const Parcel = require("../models/Parcel");
const PricingPlan = require("../models/PricingPlan");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalParcels = await Parcel.countDocuments();
    const inTransitParcels = await Parcel.countDocuments({
      status: "in_transit",
    });
    const deliveredParcels = await Parcel.countDocuments({
      status: "delivered",
    });
    const pendingParcels = await Parcel.countDocuments({ status: "pending" });

    // Calculate total revenue
    const deliveredParcelsWithAmount = await Parcel.find({
      status: "delivered",
    });
    const totalRevenue = deliveredParcelsWithAmount.reduce(
      (sum, parcel) => sum + parcel.amount,
      0
    );

    // Get recent parcels
    const recentParcels = await Parcel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("sender", "name")
      .populate("receiver", "name");

    res.status(200).json({
      status: "success",
      data: {
        totalParcels,
        inTransitParcels,
        deliveredParcels,
        pendingParcels,
        totalRevenue,
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

exports.getAllParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find()
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });

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

exports.updateParcelStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const parcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .populate("assignedDriver", "name");

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

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const parcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    )
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .populate("assignedDriver", "name");

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

exports.deleteParcel = async (req, res) => {
  try {
    const parcel = await Parcel.findByIdAndDelete(req.params.id);

    if (!parcel) {
      return res.status(404).json({
        status: "error",
        message: "Parcel not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Parcel deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getAllPricingPlans = async (req, res) => {
  try {
    const plans = await PricingPlan.find({ isActive: true });
    res.status(200).json({
      status: "success",
      data: {
        plans,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.createPricingPlan = async (req, res) => {
  try {
    const plan = await PricingPlan.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updatePricingPlan = async (req, res) => {
  try {
    const plan = await PricingPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!plan) {
      return res.status(404).json({
        status: "error",
        message: "Pricing plan not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.deletePricingPlan = async (req, res) => {
  try {
    const plan = await PricingPlan.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({
        status: "error",
        message: "Pricing plan not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Pricing plan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      { role: { $in: ["user", "driver"] } },
      "-password"
    ).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Prevent deactivating own account
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        status: "error",
        message: "You cannot deactivate your own account",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, select: "-password" }
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
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Prevent deleting own account
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        status: "error",
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.assignParcelToDriver = async (req, res) => {
  try {
    const { parcelId } = req.body;
    console.log("Assigning parcel:", parcelId);

    // First find the parcel
    const parcel = await Parcel.findById(parcelId);
    console.log("Found parcel:", parcel);

    if (!parcel) {
      return res.status(404).json({
        status: "error",
        message: "Parcel not found",
      });
    }

    // Find an available driver with debug logs
    console.log("Searching for available drivers...");
    const drivers = await User.find({
      role: "driver",
      status: "active",
    });
    console.log("Found drivers:", drivers);

    if (!drivers || drivers.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No available drivers found",
      });
    }

    // Select the first available driver
    const driver = drivers[0];
    console.log("Selected driver:", driver);

    // Update the parcel with assigned driver
    parcel.assignedDriver = driver._id;
    parcel.status = "in_transit";
    await parcel.save();
    console.log("Updated parcel:", parcel);

    // Create notifications
    await Promise.all([
      // Notify driver
      Notification.create({
        user: driver._id,
        title: "New Parcel Assignment",
        message: `You have been assigned a new parcel with tracking ID: ${parcel.trackingId}`,
        type: "parcel_update",
        parcel: parcelId,
      }),
      // Notify sender
      Notification.create({
        user: parcel.sender,
        title: "Parcel Status Update",
        message: `Your parcel (${parcel.trackingId}) has been assigned to a driver`,
        type: "parcel_update",
        parcel: parcelId,
      }),
    ]);

    // Populate the driver details before sending response
    await parcel.populate("assignedDriver", "name");
    console.log("Final parcel with populated driver:", parcel);

    res.status(200).json({
      status: "success",
      data: {
        parcel,
      },
    });
  } catch (error) {
    console.error("Error in assignParcelToDriver:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: "driver", status: "active" })
      .select("name email")
      .sort({ name: 1 });

    res.status(200).json({
      status: "success",
      data: {
        drivers,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
