import { useState } from "react";
import { motion } from "framer-motion";
import parcelService from "../../api/parcelService";
import toast from "react-hot-toast";

const TrackParcel = () => {
  const [trackingId, setTrackingId] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }

    try {
      setIsLoading(true);
      const response = await parcelService.trackParcel(trackingId);
      if (response.status === "success") {
        setTrackingResult(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to track parcel");
      setTrackingResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Track Your Parcel</h1>
        <form onSubmit={handleTrack} className="flex gap-4">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter your tracking ID"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Tracking..." : "Track"}
          </button>
        </form>
      </div>

      {trackingResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          {/* Parcel Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Parcel Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Tracking ID</p>
                <p className="font-medium">
                  {trackingResult.parcel.trackingId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    trackingResult.parcel.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : trackingResult.parcel.status === "in_transit"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {trackingResult.parcel.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="font-medium">
                  {new Date(
                    trackingResult.estimatedDelivery
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Tracking Timeline</h2>
            <div className="space-y-6">
              {trackingResult.timeline.map((event, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-12">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        index === trackingResult.timeline.length - 1
                          ? "bg-green-500"
                          : "bg-blue-500"
                      } mx-auto`}
                    />
                    {index !== trackingResult.timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-blue-200 mx-auto mt-2" />
                    )}
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="font-medium">{event.status}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {event.location}
                    </div>
                    <div className="text-sm text-gray-500">
                      {event.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrackParcel;
