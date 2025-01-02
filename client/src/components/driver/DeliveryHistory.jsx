import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import driverService from "../../api/driverService";

const DeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setIsLoading(true);
      const response = await driverService.getPickedParcels();
      if (response.status === "success") {
        setDeliveries(response.data.parcels);
      }
    } catch (error) {
      toast.error("Failed to load deliveries");
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
        toast.success(`Parcel status updated to ${newStatus}`);
        loadDeliveries();
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentUpdate = async (parcelId, paymentStatus) => {
    try {
      setIsUpdating(true);
      const response = await driverService.updateParcelPayment(parcelId, {
        paymentStatus,
      });
      if (response.status === "success") {
        toast.success(`Payment marked as ${paymentStatus}`);
        loadDeliveries();
      }
    } catch (error) {
      toast.error("Failed to update payment status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Delivery History
        </h1>
        <button
          onClick={loadDeliveries}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Refresh List
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tracking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Receiver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveries.map((delivery) => (
                <tr key={delivery._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {delivery.trackingId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {delivery.receiver.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {delivery.deliveryAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    NPR {delivery.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={delivery.status}
                      onChange={(e) =>
                        handleStatusUpdate(delivery._id, e.target.value)
                      }
                      disabled={isUpdating || delivery.status === "delivered"}
                      className="rounded-md border-gray-300"
                    >
                      <option value="picked_up">Picked Up</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={delivery.paymentStatus}
                      onChange={(e) =>
                        handlePaymentUpdate(delivery._id, e.target.value)
                      }
                      disabled={
                        isUpdating ||
                        delivery.status !== "delivered" ||
                        delivery.paymentStatus === "paid"
                      }
                      className="rounded-md border-gray-300"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.status === "delivered" &&
                    delivery.paymentStatus === "paid" ? (
                      <span className="text-green-600">Completed</span>
                    ) : (
                      <span className="text-yellow-600">In Progress</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeliveryHistory;
