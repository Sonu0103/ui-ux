import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import userService from "../api/userService";

const TrackParcel = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [parcel, setParcel] = useState(null);
  const [searchId, setSearchId] = useState(trackingId || "");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }

    try {
      setIsLoading(true);
      const response = await userService.trackParcel(searchId);
      if (response.status === "success") {
        setParcel(response.data.parcel);
        if (!trackingId) {
          navigate(`/track/${searchId}`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to track parcel");
      setParcel(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Track Your Parcel</h1>
        <p className="mt-2 text-gray-600">
          Enter your tracking number to see the current status
        </p>
      </div>

      <form onSubmit={handleTrack} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter tracking number"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isLoading ? "Tracking..." : "Track"}
          </button>
        </div>
      </form>

      {parcel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Parcel Details</h2>
              <div className="space-y-3">
                <p>
                  <span className="font-medium">Tracking ID:</span>{" "}
                  {parcel.trackingId}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      parcel.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : parcel.status === "in_transit"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {parcel.status}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(parcel.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
              <div className="space-y-3">
                <p>
                  <span className="font-medium">Receiver:</span>{" "}
                  {parcel.receiver.name}
                </p>
                <p>
                  <span className="font-medium">Delivery Address:</span>{" "}
                  {parcel.deliveryAddress}
                </p>
                <p>
                  <span className="font-medium">Driver:</span>{" "}
                  {parcel.assignedDriver?.name || "Not assigned yet"}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Tracking Timeline</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {parcel.status === "delivered" && (
                  <div className="relative flex items-center">
                    <div className="absolute left-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">✓</span>
                    </div>
                    <div className="ml-12">
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-gray-500">
                        Package has been delivered
                      </p>
                    </div>
                  </div>
                )}
                {(parcel.status === "delivered" ||
                  parcel.status === "in_transit") && (
                  <div className="relative flex items-center">
                    <div
                      className={`absolute left-0 w-8 h-8 ${
                        parcel.status === "in_transit"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      } rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white text-lg">↻</span>
                    </div>
                    <div className="ml-12">
                      <p className="font-medium">In Transit</p>
                      <p className="text-sm text-gray-500">
                        Package is on the way
                      </p>
                    </div>
                  </div>
                )}
                <div className="relative flex items-center">
                  <div
                    className={`absolute left-0 w-8 h-8 ${
                      parcel.status === "pending"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    } rounded-full flex items-center justify-center`}
                  >
                    <span className="text-white text-lg">●</span>
                  </div>
                  <div className="ml-12">
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-gray-500">
                      {new Date(parcel.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrackParcel;
