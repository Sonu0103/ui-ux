import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { driverAPI } from "../../api/apis";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiMapPin,
  FiPhone,
  FiDollarSign,
  FiRefreshCw,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiLoader,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";

const DeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setIsLoading(true);
      const response = await driverAPI.getPickedParcels();
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
      const response = await driverAPI.updateParcelStatus(parcelId, {
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
      const response = await driverAPI.updateParcelPayment(parcelId, {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 ring-green-600/20";
      case "in_transit":
        return "bg-yellow-100 text-yellow-800 ring-yellow-600/20";
      case "picked_up":
        return "bg-blue-100 text-blue-800 ring-blue-600/20";
      default:
        return "bg-gray-100 text-gray-800 ring-gray-600/20";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 ring-green-600/20";
      case "pending":
        return "bg-orange-100 text-orange-800 ring-orange-600/20";
      default:
        return "bg-gray-100 text-gray-800 ring-gray-600/20";
    }
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      searchQuery === "" ||
      delivery.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.receiver.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      delivery.deliveryAddress
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || delivery.status === filterStatus;

    const matchesPayment =
      filterPayment === "all" || delivery.paymentStatus === filterPayment;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calculate statistics
  const stats = {
    total: filteredDeliveries.length,
    delivered: filteredDeliveries.filter((d) => d.status === "delivered")
      .length,
    paid: filteredDeliveries.filter((d) => d.paymentStatus === "paid").length,
    totalAmount: filteredDeliveries.reduce((sum, d) => sum + d.amount, 0),
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Delivery History
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage your past deliveries
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={loadDeliveries}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiRefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiPackage className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Deliveries
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Delivered</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.delivered}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Payments Received
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.paid}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-2xl font-semibold text-gray-900">
                NPR {stats.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by tracking ID, receiver, or address..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div className="w-full lg:w-48">
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="w-full lg:w-48">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Deliveries Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="p-8 text-center">
            <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No deliveries found
            </h3>
            <p className="text-gray-500">
              {searchQuery || filterStatus !== "all" || filterPayment !== "all"
                ? "Try adjusting your search or filters"
                : "No delivery history available"}
            </p>
          </div>
        ) : (
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
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeliveries.map((delivery) => (
                  <tr
                    key={delivery._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {delivery.trackingId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {delivery.receiver.name}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FiPhone className="w-4 h-4 mr-1" />
                          {delivery.receiver.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiMapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate max-w-xs">
                          {delivery.deliveryAddress}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        NPR {delivery.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${getStatusColor(
                          delivery.status
                        )}`}
                      >
                        {delivery.status === "delivered" ? (
                          <FiCheckCircle className="w-4 h-4" />
                        ) : delivery.status === "in_transit" ? (
                          <FiTruck className="w-4 h-4" />
                        ) : (
                          <FiPackage className="w-4 h-4" />
                        )}
                        {delivery.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${getPaymentStatusColor(
                          delivery.paymentStatus
                        )}`}
                      >
                        <FiDollarSign className="w-4 h-4" />
                        {delivery.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DeliveryHistory;
