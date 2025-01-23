import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { adminAPI, userAPI } from "../../api/apis";
import {
  FiPackage,
  FiTruck,
  FiDollarSign,
  FiCalendar,
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiX,
  FiCheck,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiClock,
  FiRefreshCw,
  FiChevronDown,
} from "react-icons/fi";

const ManageParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    inTransit: 0,
    pending: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    loadParcels();
    loadDrivers();
  }, []);

  useEffect(() => {
    filterParcels();
  }, [parcels, searchQuery, statusFilter, paymentFilter, dateRange]);

  const loadParcels = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getAllParcels();
      if (response.status === "success") {
        setParcels(response.data.parcels);
        calculateStats(response.data.parcels);
      }
    } catch (error) {
      console.error("Failed to load parcels:", error);
      toast.error("Failed to load parcels");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDrivers = async () => {
    try {
      const response = await adminAPI.getDrivers();
      if (response.status === "success") {
        setAvailableDrivers(response.data.drivers);
      }
    } catch (error) {
      console.error("Failed to load drivers:", error);
    }
  };

  const calculateStats = (parcelData) => {
    const stats = parcelData.reduce(
      (acc, parcel) => {
        acc.total++;
        acc.totalAmount += parcel.amount;

        switch (parcel.status) {
          case "delivered":
            acc.delivered++;
            break;
          case "in_transit":
            acc.inTransit++;
            break;
          default:
            acc.pending++;
        }

        return acc;
      },
      { total: 0, delivered: 0, inTransit: 0, pending: 0, totalAmount: 0 }
    );

    setStats(stats);
  };

  const filterParcels = () => {
    let filtered = [...parcels];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (parcel) =>
          parcel.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          parcel.sender.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          parcel.receiver.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((parcel) => parcel.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(
        (parcel) => parcel.paymentStatus === paymentFilter
      );
    }

    // Date range filter
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      filtered = filtered.filter((parcel) => {
        const parcelDate = new Date(parcel.createdAt);
        return parcelDate >= fromDate && parcelDate <= toDate;
      });
    }

    setFilteredParcels(filtered);
  };

  const handleAssignDriver = async (parcelId, driverId) => {
    try {
      const response = await adminAPI.assignParcelToDriver({
        parcelId,
        driverId,
      });

      if (response.status === "success") {
        toast.success(
          `Parcel assigned to ${response.data.parcel.assignedDriver.name}`
        );
        loadParcels();
        setIsAssignDriverModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to assign driver:", error);
      toast.error(error.response?.data?.message || "Failed to assign driver");
    }
  };

  const handleUpdateStatus = async (parcelId, newStatus) => {
    try {
      const response = await adminAPI.updateParcelStatus(parcelId, {
        status: newStatus,
      });

      if (response.status === "success") {
        toast.success("Parcel status updated successfully");
        loadParcels();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update parcel status");
    }
  };

  const handleDelete = async (parcelId) => {
    if (window.confirm("Are you sure you want to delete this parcel?")) {
      try {
        const response = await adminAPI.deleteParcel(parcelId);
        if (response.status === "success") {
          toast.success("Parcel deleted successfully");
          setParcels(parcels.filter((parcel) => parcel._id !== parcelId));
        }
      } catch (error) {
        console.error("Failed to delete parcel:", error);
        toast.error("Failed to delete parcel");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_transit":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="p-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Parcels</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <FiPackage className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-semibold text-green-600">
                {stats.delivered}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <FiCheck className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Transit</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {stats.inTransit}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <FiTruck className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-600">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-full">
              <FiClock className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-semibold text-blue-600">
                NPR {stats.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <FiDollarSign className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search parcels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>

          <input
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Parcels Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receiver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <FiRefreshCw className="w-5 h-5 text-blue-500 animate-spin mr-2" />
                      Loading parcels...
                    </div>
                  </td>
                </tr>
              ) : filteredParcels.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No parcels found
                  </td>
                </tr>
              ) : (
                filteredParcels.map((parcel) => (
                  <motion.tr
                    key={parcel._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedParcel(parcel);
                          setIsDetailsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {parcel.trackingId}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {parcel.sender.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {parcel.receiver.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(
                          parcel.status
                        )}`}
                      >
                        {parcel.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs rounded-full border ${
                          parcel.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }`}
                      >
                        {parcel.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      NPR {parcel.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {parcel.assignedDriver ? (
                        <span className="text-green-600">
                          {parcel.assignedDriver.name}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedParcel(parcel);
                            setIsAssignDriverModalOpen(true);
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          Assign Driver
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            setSelectedParcel(parcel);
                            setIsDetailsModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(parcel._id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parcel Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedParcel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Parcel Details
                  </h2>
                  <button
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tracking Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Tracking Information
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Tracking ID</p>
                          <p className="font-medium">
                            {selectedParcel.trackingId}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <select
                            value={selectedParcel.status}
                            onChange={(e) =>
                              handleUpdateStatus(
                                selectedParcel._id,
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Created At</p>
                          <p className="font-medium">
                            {new Date(
                              selectedParcel.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="font-medium">
                            {new Date(
                              selectedParcel.updatedAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Package Details */}
                    <h3 className="text-lg font-medium text-gray-900">
                      Package Details
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Weight</p>
                          <p className="font-medium">
                            {selectedParcel.packageDetails.weight} kg
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium">
                            {selectedParcel.packageDetails.category}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fragile</p>
                          <p className="font-medium">
                            {selectedParcel.packageDetails.isFragile
                              ? "Yes"
                              : "No"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sender & Receiver Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Sender Information
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">
                          {selectedParcel.sender.name}
                        </p>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">
                          {selectedParcel.sender.phone}
                        </p>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">
                          {selectedParcel.sender.email}
                        </p>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">
                          {selectedParcel.pickupAddress}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900">
                      Receiver Information
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">
                          {selectedParcel.receiver.name}
                        </p>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">
                          {selectedParcel.receiver.phone}
                        </p>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">
                          {selectedParcel.receiver.email}
                        </p>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">
                          {selectedParcel.deliveryAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Driver Modal */}
      <AnimatePresence>
        {isAssignDriverModalOpen && selectedParcel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-lg w-full"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Assign Driver
                  </h2>
                  <button
                    onClick={() => setIsAssignDriverModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {availableDrivers.map((driver) => (
                    <button
                      key={driver._id}
                      onClick={() =>
                        handleAssignDriver(selectedParcel._id, driver._id)
                      }
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">
                            {driver.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {driver.email}
                          </p>
                        </div>
                      </div>
                      <FiChevronDown className="w-5 h-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageParcels;
