import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import adminService from "../../api/adminService";

const ManageParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadParcels();
  }, []);

  const loadParcels = async () => {
    try {
      const response = await adminService.getAllParcels();
      if (response.status === "success") {
        setParcels(response.data.parcels);
      }
    } catch (error) {
      toast.error("Failed to load parcels");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignDriver = async (parcelId) => {
    try {
      const response = await adminService.assignParcelToDriver({ parcelId });

      if (response.status === "success") {
        toast.success(
          `Parcel assigned to ${response.data.parcel.assignedDriver.name}`
        );
        loadParcels(); // Refresh the parcels list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign driver");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Manage Parcels
      </h1>

      {/* Parcels Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tracking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Receiver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Assigned Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {parcel.trackingId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {parcel.sender.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {parcel.receiver.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedParcel(parcel);
                        setIsStatusModalOpen(true);
                      }}
                      className={`px-2 py-1 text-xs rounded-full ${
                        parcel.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : parcel.status === "in_transit"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {parcel.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedParcel(parcel);
                        setIsPaymentModalOpen(true);
                      }}
                      className={`px-2 py-1 text-xs rounded-full ${
                        parcel.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {parcel.paymentStatus}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    NPR {parcel.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parcel.assignedDriver ? (
                      <span className="text-green-600">
                        {parcel.assignedDriver.name}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAssignDriver(parcel._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Assign Driver
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(parcel._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageParcels;
