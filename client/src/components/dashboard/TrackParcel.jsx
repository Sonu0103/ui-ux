import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import userService from "../../api/userService";

const TrackParcel = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [parcel, setParcel] = useState(null);
  const [searchId, setSearchId] = useState(trackingId || "");

  useEffect(() => {
    if (trackingId) {
      handleTrack(null, trackingId);
    }
  }, [trackingId]);

  const handleTrack = async (e, id = searchId) => {
    if (e) e.preventDefault();

    if (!id.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }

    try {
      setIsLoading(true);
      const response = await userService.trackParcel(id);
      if (response.status === "success") {
        setParcel(response.data.parcel);
        if (!trackingId) {
          navigate(`/dashboard/track-parcel/${id}`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to track parcel");
      setParcel(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { status: "pending", label: "Order Placed" },
      { status: "in_transit", label: "In Transit" },
      { status: "out_for_delivery", label: "Out for Delivery" },
      { status: "delivered", label: "Delivered" },
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
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Track Your Parcel
        </h1>

        <form onSubmit={handleTrack} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter tracking ID"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? "Tracking..." : "Track"}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {parcel && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Tracking ID
                  </h3>
                  <p className="mt-1 text-lg font-medium">
                    {parcel.trackingId}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-sm rounded-full ${
                        parcel.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {parcel.status}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Receiver
                  </h3>
                  <p className="mt-1">{parcel.receiver.name}</p>
                  <p className="text-sm text-gray-500">
                    {parcel.receiver.address}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Delivery Type
                  </h3>
                  <p className="mt-1">{parcel.deliveryType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                  <p className="mt-1">NPR {parcel.amount}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Payment Status
                  </h3>
                  <p className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-sm rounded-full ${
                        parcel.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {parcel.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-lg font-medium mb-4">Tracking Timeline</h3>
              <div className="space-y-8">
                {getStatusSteps().map((step, index) => (
                  <div key={step.status} className="relative flex items-center">
                    {index < getStatusSteps().length - 1 && (
                      <div
                        className={`absolute left-2.5 h-full w-0.5 -bottom-8 ${
                          step.completed ? "bg-blue-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                    <div
                      className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full ${
                        step.completed ? "bg-blue-500" : "bg-gray-200"
                      }`}
                    >
                      {step.completed && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {step.label}
                      </p>
                      {step.completed && step.status === parcel.status && (
                        <p className="text-sm text-gray-500">
                          {new Date(parcel.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TrackParcel;
