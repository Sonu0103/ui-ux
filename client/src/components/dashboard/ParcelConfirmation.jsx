import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const ParcelConfirmation = () => {
  const navigate = useNavigate();

  // Mock parcel data (you would typically get this from your state management)
  const parcelDetails = {
    trackingId: "NEP" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    sender: {
      name: "John Doe",
      address: "Thamel, Kathmandu",
      phone: "+977 9876543210",
    },
    receiver: {
      name: "Jane Smith",
      address: "Patan, Lalitpur",
      phone: "+977 9876543211",
    },
    parcel: {
      weight: "2.5 kg",
      description: "Electronics",
      deliveryType: "Standard Delivery",
      amount: "NPR 250",
    },
  };

  const handleConfirm = () => {
    toast.success("Parcel booked successfully!");
    navigate("/dashboard/orders");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Parcel Confirmation
          </h1>
          <p className="text-gray-600 mt-2">
            Please review your parcel details below
          </p>
        </div>

        <div className="space-y-6">
          {/* Tracking ID */}
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Tracking ID</p>
            <p className="text-xl font-semibold text-blue-600">
              {parcelDetails.trackingId}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sender Details */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Sender Details</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Name:</span>{" "}
                  {parcelDetails.sender.name}
                </p>
                <p>
                  <span className="text-gray-600">Address:</span>{" "}
                  {parcelDetails.sender.address}
                </p>
                <p>
                  <span className="text-gray-600">Phone:</span>{" "}
                  {parcelDetails.sender.phone}
                </p>
              </div>
            </div>

            {/* Receiver Details */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Receiver Details</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Name:</span>{" "}
                  {parcelDetails.receiver.name}
                </p>
                <p>
                  <span className="text-gray-600">Address:</span>{" "}
                  {parcelDetails.receiver.address}
                </p>
                <p>
                  <span className="text-gray-600">Phone:</span>{" "}
                  {parcelDetails.receiver.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Parcel Details */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Parcel Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-600">Weight</p>
                <p className="font-semibold">{parcelDetails.parcel.weight}</p>
              </div>
              <div>
                <p className="text-gray-600">Description</p>
                <p className="font-semibold">
                  {parcelDetails.parcel.description}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Delivery Type</p>
                <p className="font-semibold">
                  {parcelDetails.parcel.deliveryType}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Amount</p>
                <p className="font-semibold">{parcelDetails.parcel.amount}</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
            <p>Cash on Delivery (COD)</p>
          </div>

          {/* Action Buttons */}
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
        </div>
      </motion.div>
    </div>
  );
};

export default ParcelConfirmation;
