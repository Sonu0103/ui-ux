import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { userAPI, authAPI } from "../../api/apis";
import toast from "react-hot-toast";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiAlertCircle,
  FiSearch,
  FiPlus,
} from "react-icons/fi";

const MyOrders = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userAPI.getUserParcels();

      if (response.status === "success") {
        setOrders(response.data.parcels);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch orders";
      setError(errorMessage);
      toast.error(errorMessage);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === "all" || order.status.toLowerCase() === filter;
    const matchesSearch =
      searchQuery === "" ||
      order.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.receiver.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleTrack = (orderId) => {
    navigate(`/dashboard/track-parcel/${orderId}`);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleRetry = () => {
    fetchOrders();
  };

  const handleCreateOrder = () => {
    navigate("/dashboard/create-parcel");
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <FiCheckCircle className="w-4 h-4" />;
      case "in_transit":
        return <FiTruck className="w-4 h-4" />;
      case "pending":
        return <FiPackage className="w-4 h-4" />;
      case "cancelled":
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return <FiPackage className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200 ring-green-600/20";
      case "in_transit":
        return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-600/20";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200 ring-red-600/20";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 ring-gray-600/20";
    }
  };

  const getStatusBadge = (status) => {
    const colorClasses = getStatusColor(status);
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${colorClasses} ring-1 ring-inset`}
      >
        {getStatusIcon(status)}
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">
              Track and manage your parcel deliveries
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleCreateOrder}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm gap-2"
            >
              <FiPlus className="w-5 h-5" />
              <span>New Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="text-4xl">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900">
              Failed to load orders
            </h3>
            <p className="text-gray-600 text-center max-w-md">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <FiPackage className="w-12 h-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "No orders match your search"
                : filter === "all"
                ? "You haven't created any orders yet"
                : `No ${filter} orders found`}
            </p>
            <button
              onClick={handleCreateOrder}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm gap-2"
            >
              <FiPlus className="w-5 h-5" />
              <span>Create New Order</span>
            </button>
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
                    Date
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
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiPackage className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          {order.trackingId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {order.receiver.name}
                        </p>
                        <p className="text-gray-500">{order.receiver.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.deliveryAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        NPR {order.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleTrack(order.trackingId)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        Track
                      </button>
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Tracking ID</p>
                    <div className="flex items-center mt-1">
                      <FiPackage className="w-5 h-5 text-gray-400 mr-2" />
                      <p className="font-medium text-blue-600">
                        {selectedOrder.trackingId}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium mt-1">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Current Status
                  </h3>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                {/* Receiver Info */}
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Receiver Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium mt-1">
                        {selectedOrder.receiver.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium mt-1">
                        {selectedOrder.receiver.phone}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium mt-1">
                        {selectedOrder.receiver.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Package Details */}
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Package Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Weight</p>
                      <p className="font-medium mt-1">
                        {selectedOrder.packageDetails.weight} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium mt-1 capitalize">
                        {selectedOrder.packageDetails.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delivery Type</p>
                      <p className="font-medium mt-1 capitalize">
                        {selectedOrder.deliveryType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-medium mt-1">
                        NPR {selectedOrder.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Delivery Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Pickup Address</p>
                      <p className="font-medium mt-1">
                        {selectedOrder.pickupAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delivery Address</p>
                      <p className="font-medium mt-1">
                        {selectedOrder.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Driver Info */}
                {selectedOrder.assignedDriver && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Driver Information
                    </h3>
                    <div className="flex items-center">
                      <FiTruck className="w-5 h-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Assigned Driver</p>
                        <p className="font-medium mt-1">
                          {selectedOrder.assignedDriver.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => handleTrack(selectedOrder.trackingId)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm gap-2"
                >
                  <FiTruck className="w-5 h-5" />
                  Track Parcel
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrders;
