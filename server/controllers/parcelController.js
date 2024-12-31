const Parcel = require("../models/Parcel");

exports.createParcel = async (req, res) => {
  try {
    const { senderDetails, receiverDetails, parcelDetails, amount } = req.body;

    // Create parcel with validated data
    const parcelData = {
      user: req.user._id,
      senderDetails: {
        name: senderDetails.name,
        phone: senderDetails.phone,
        address: senderDetails.address,
      },
      receiverDetails: {
        name: receiverDetails.name,
        phone: receiverDetails.phone,
        address: receiverDetails.address,
      },
      parcelDetails: {
        weight: parseFloat(parcelDetails.weight),
        length: parseFloat(parcelDetails.length),
        width: parseFloat(parcelDetails.width),
        height: parseFloat(parcelDetails.height),
        description: parcelDetails.description || "",
        specialInstructions: parcelDetails.specialInstructions || "",
      },
      paymentDetails: {
        amount: parseFloat(amount),
        method: "COD",
        status: "pending",
      },
    };

    // Create new parcel
    const parcel = await Parcel.create(parcelData);

    res.status(201).json({
      status: "success",
      data: {
        parcel,
      },
    });
  } catch (error) {
    console.error("Create parcel error:", error);
    // Send more specific error message
    res.status(400).json({
      status: "error",
      message:
        error.code === 11000
          ? "Failed to generate unique tracking ID. Please try again."
          : error.message || "Failed to create parcel",
    });
  }
};

exports.getUserParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      status: "success",
      data: {
        parcels,
      },
    });
  } catch (error) {
    console.error("Get user parcels error:", error);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getParcelById = async (req, res) => {
  try {
    const parcel = await Parcel.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

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
    console.error("Get parcel error:", error);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalParcels = await Parcel.countDocuments({ user: req.user._id });
    const inTransitParcels = await Parcel.countDocuments({
      user: req.user._id,
      status: "in_transit",
    });
    const deliveredParcels = await Parcel.countDocuments({
      user: req.user._id,
      status: "delivered",
    });
    const totalSpent = await Parcel.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: "$paymentDetails.amount" } } },
    ]);

    const recentParcels = await Parcel.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      status: "success",
      data: {
        stats: {
          totalParcels,
          inTransitParcels,
          deliveredParcels,
          totalSpent: totalSpent[0]?.total || 0,
        },
        recentParcels,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.confirmParcelPayment = async (req, res) => {
  try {
    const parcel = await Parcel.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        $set: {
          "paymentDetails.status": "paid",
          status: "processing",
        },
      },
      { new: true }
    );

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
    console.error("Confirm payment error:", error);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Parcel.find(
      { user: req.user._id },
      {
        trackingId: 1,
        paymentDetails: 1,
        createdAt: 1,
        status: 1,
      }
    ).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: {
        payments,
      },
    });
  } catch (error) {
    console.error("Get payment history error:", error);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.trackParcel = async (req, res) => {
  try {
    const { trackingId } = req.params;

    const parcel = await Parcel.findOne({ trackingId });

    if (!parcel) {
      return res.status(404).json({
        status: "error",
        message: "No parcel found with this tracking ID",
      });
    }

    // Create a tracking timeline based on parcel status
    const timeline = [];
    const createdDate = new Date(parcel.createdAt);

    timeline.push({
      status: "Order Placed",
      date: createdDate,
      location: parcel.senderDetails.address,
      description: "Parcel has been booked",
    });

    if (
      parcel.status === "processing" ||
      parcel.status === "in_transit" ||
      parcel.status === "delivered"
    ) {
      timeline.push({
        status: "Processing",
        date: new Date(createdDate.getTime() + 1 * 60 * 60 * 1000), // 1 hour after creation
        location: "Sorting Facility",
        description: "Parcel is being processed at our facility",
      });
    }

    if (parcel.status === "in_transit" || parcel.status === "delivered") {
      timeline.push({
        status: "In Transit",
        date: new Date(createdDate.getTime() + 24 * 60 * 60 * 1000), // 24 hours after creation
        location: "In Transit",
        description: "Parcel is on the way to delivery location",
      });
    }

    if (parcel.status === "delivered") {
      timeline.push({
        status: "Delivered",
        date: new Date(createdDate.getTime() + 72 * 60 * 60 * 1000), // 72 hours after creation
        location: parcel.receiverDetails.address,
        description: "Parcel has been delivered successfully",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        parcel,
        timeline,
        estimatedDelivery: new Date(
          createdDate.getTime() + 72 * 60 * 60 * 1000
        ),
      },
    });
  } catch (error) {
    console.error("Track parcel error:", error);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
