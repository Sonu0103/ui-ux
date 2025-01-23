import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { userAPI } from "../../api/apis";
import Map from "../common/Map";
import { geocodeAddress } from "../../utils/geocoding";
import {
  FiPackage,
  FiSearch,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiUser,
  FiTruck,
} from "react-icons/fi";

const TrackParcel = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [parcel, setParcel] = useState(null);
  const [searchId, setSearchId] = useState(trackingId || "");
  const [mapMarkers, setMapMarkers] = useState([]);

  useEffect(() => {
    if (trackingId) {
      handleTrack(null, trackingId);
    }
  }, [trackingId]);

  useEffect(() => {
    if (parcel) {
      updateMapMarkers();
    }
  }, [parcel]);

  const handleTrack = async (e, id = searchId) => {
    if (e) e.preventDefault();
    if (!id.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }

    try {
      setIsLoading(true);
      const response = await userAPI.trackParcel(id);
      if (response.status === "success") {
        setParcel(response.data.parcel);
        if (!trackingId) {
          navigate(`/dashboard/track-parcel/${id}`);
        }
        toast.success("Parcel found!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to track parcel");
      setParcel(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMapMarkers = async () => {
    try {
      const markers = [];
      const pickupCoords = await geocodeAddress(parcel.pickupAddress);
      if (pickupCoords) {
        markers.push({
          ...pickupCoords,
          title: "Pickup Location",
          description: parcel.pickupAddress,
        });
      }
      const deliveryCoords = await geocodeAddress(parcel.deliveryAddress);
      if (deliveryCoords) {
        markers.push({
          ...deliveryCoords,
          title: "Delivery Location",
          description: parcel.deliveryAddress,
        });
      }
      setMapMarkers(markers);
    } catch (error) {
      console.error("Error updating map markers:", error);
      toast.error("Failed to load location markers");
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { status: "pending", label: "Order Placed", icon: <FiPackage /> },
      { status: "in_transit", label: "In Transit", icon: <FiTruck /> },
      {
        status: "out_for_delivery",
        label: "Out for Delivery",
        icon: <FiMapPin />,
      },
      { status: "delivered", label: "Delivered", icon: <FiUser /> },
    ];

    const currentStepIndex = steps.findIndex(
      (step) => step.status === parcel?.status
    );
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStepIndex,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Track Your Parcel
        </h1>
        <p className="text-blue-100 mb-8">
          Enter your tracking number to get real-time updates on your delivery
        </p>

        <form onSubmit={handleTrack} className="relative max-w-2xl">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter tracking number (e.g., NEP123456)"
              className="w-full px-6 py-4 pr-32 rounded-xl text-gray-800 placeholder-gray-400 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center gap-2"
            >
              <FiSearch className="w-4 h-4" />
              {isLoading ? "Searching..." : "Track"}
            </button>
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {parcel && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Status Timeline */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiClock className="text-blue-600" />
              Tracking Timeline
            </h2>
            <div className="relative">
              {getStatusSteps().map((step, index) => (
                <div
                  key={step.status}
                  className="flex items-start mb-8 last:mb-0"
                >
                  <div className="relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={
                          step.completed ? "text-white" : "text-gray-500"
                        }
                      >
                        {step.icon}
                      </span>
                    </div>
                    {index < getStatusSteps().length - 1 && (
                      <div
                        className={`absolute left-4 top-8 w-0.5 h-12 -translate-x-1/2 ${
                          step.completed ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3
                      className={`font-medium ${
                        step.completed ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </h3>
                    {step.completed && step.status === parcel.status && (
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(parcel.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parcel Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FiPackage className="text-blue-600" />
                Parcel Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Tracking ID</span>
                  <span className="font-medium">{parcel.trackingId}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      parcel.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : parcel.status === "in_transit"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {parcel.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-medium">
                    {parcel.packageDetails.weight} kg
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium capitalize">
                    {parcel.packageDetails.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FiUser className="text-blue-600" />
                Delivery Information
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    Receiver
                  </h3>
                  <p className="font-medium">{parcel.receiver.name}</p>
                  <p className="text-sm text-gray-500">
                    {parcel.receiver.phone}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    Delivery Address
                  </h3>
                  <p className="text-gray-800">{parcel.deliveryAddress}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    Payment Status
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      parcel.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {parcel.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium text-lg">
                    NPR {parcel.amount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          {mapMarkers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FiMapPin className="text-blue-600" />
                Delivery Route
              </h2>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <Map markers={mapMarkers} />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TrackParcel;
