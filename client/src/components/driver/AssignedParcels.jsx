import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import driverService from "../../api/driverService";

const AssignedParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadParcels();
  }, []);

  const loadParcels = async () => {
    try {
      setIsLoading(true);
      const response = await driverService.getAssignedParcels();
      if (response.status === "success") {
        setParcels(response.data.parcels);
      }
    } catch (error) {
      toast.error("Failed to load parcels");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (parcelId, newStatus) => {
    try {
      setIsUpdating(true);
      const response = await driverService.updateParcelStatus(parcelId, {
        status: newStatus,
      });

      if (response.status === "success") {
        toast.success(`Parcel marked as ${newStatus}`);
        loadParcels(); // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentUpdate = async (parcelId) => {
    try {
      setIsUpdating(true);
      const response = await driverService.updateParcelPayment(parcelId);
      if (response.status === "success") {
        toast.success("Payment marked as received");
        loadParcels();
      }
    } catch (error) {
      toast.error("Failed to update payment status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusActions = (parcel) => {
    switch (parcel.status) {
      case "pending":
        return (
          <button
            onClick={() => handleStatusUpdate(parcel._id, "picked_up")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={isUpdating}
          >
            Mark as Picked Up
          </button>
        );
      case "picked_up":
        return (
          <button
            onClick={() => handleStatusUpdate(parcel._id, "in_transit")}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            disabled={isUpdating}
          >
            Start Delivery
          </button>
        );
      case "in_transit":
        return (
          <button
            onClick={() => handleStatusUpdate(parcel._id, "delivered")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            disabled={isUpdating}
          >
            Mark as Delivered
          </button>
        );
      case "delivered":
        if (parcel.paymentStatus === "pending") {
          return (
            <button
              onClick={() => handlePaymentUpdate(parcel._id)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              disabled={isUpdating}
            >
              Mark Payment Received
            </button>
          );
        }
        return <span className="text-green-600">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Assigned Parcels
        </h1>
        <button
          onClick={loadParcels}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Refresh List
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : parcels.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">
            No parcels are currently assigned to you.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            New assignments will appear here when available.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receiver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parcels.length > 0 ? (
                  parcels.map((parcel) => (
                    <motion.tr
                      key={parcel._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {parcel.trackingId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <p className="font-medium">{parcel.receiver.name}</p>
                          <p>{parcel.receiver.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {parcel.deliveryAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            parcel.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {parcel.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getStatusActions(parcel)}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No parcels assigned
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedParcels;
