import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import parcelService from "../../api/parcelService";

const ParcelConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [parcel, setParcel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadParcelDetails = async () => {
      try {
        if (!location.state?.parcelId) {
          throw new Error("No parcel ID found");
        }

        const response = await parcelService.getParcelById(
          location.state.parcelId
        );
        if (response.status === "success") {
          setParcel(response.data.parcel);
        }
      } catch (error) {
        toast.error("Failed to load parcel details");
        navigate("/dashboard/create-parcel");
      } finally {
        setIsLoading(false);
      }
    };

    loadParcelDetails();
  }, [location.state?.parcelId, navigate]);

  const handleConfirm = async () => {
    try {
      // Here you would typically update the parcel status
      toast.success("Parcel booking confirmed!");
      navigate("/dashboard/orders");
    } catch (error) {
      toast.error("Failed to confirm booking");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!parcel) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Confirm Your Booking
        </h1>

        <div className="space-y-8">
          {/* Tracking ID */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900">
              Tracking ID: {parcel.trackingId}
            </h2>
          </div>

          {/* Sender & Receiver Details */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sender Details</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Name:</span>{" "}
                  {parcel.senderDetails.name}
                </p>
                <p>
                  <span className="text-gray-600">Phone:</span>{" "}
                  {parcel.senderDetails.phone}
                </p>
                <p>
                  <span className="text-gray-600">Address:</span>{" "}
                  {parcel.senderDetails.address}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Receiver Details</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Name:</span>{" "}
                  {parcel.receiverDetails.name}
                </p>
                <p>
                  <span className="text-gray-600">Phone:</span>{" "}
                  {parcel.receiverDetails.phone}
                </p>
                <p>
                  <span className="text-gray-600">Address:</span>{" "}
                  {parcel.receiverDetails.address}
                </p>
              </div>
            </div>
          </div>

          {/* Parcel Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Parcel Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="text-gray-600">Weight:</span>{" "}
                  {parcel.parcelDetails.weight} kg
                </p>
                <p>
                  <span className="text-gray-600">Dimensions:</span>{" "}
                  {parcel.parcelDetails.length} × {parcel.parcelDetails.width} ×{" "}
                  {parcel.parcelDetails.height} cm
                </p>
              </div>
              <div>
                <p>
                  <span className="text-gray-600">Description:</span>{" "}
                  {parcel.parcelDetails.description || "N/A"}
                </p>
                <p>
                  <span className="text-gray-600">Special Instructions:</span>{" "}
                  {parcel.parcelDetails.specialInstructions || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="text-lg font-medium">Cash on Delivery (COD)</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600">
                  NPR {parcel.paymentDetails.amount}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Confirm Booking
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ParcelConfirmation;
