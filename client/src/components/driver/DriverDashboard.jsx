import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { driverAPI } from "../../api/apis";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiDollarSign,
  FiClock,
  FiMapPin,
  FiLoader,
  FiArrowRight,
} from "react-icons/fi";

const DriverDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    inTransitParcels: 0,
    deliveredParcels: 0,
    pendingParcels: 0,
    todayDeliveries: 0,
    recentDeliveries: [],
    totalEarnings: 0,
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await driverAPI.getDashboardStats();
      if (response.status === "success") {
        setStats(response.data);
      }
    } catch (error) {
      toast.error("Failed to load dashboard statistics");
    } finally {
      setIsLoading(false);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FiCheckCircle className="w-4 h-4" />;
      case "in_transit":
        return <FiTruck className="w-4 h-4" />;
      case "picked_up":
        return <FiPackage className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back! 👋</h1>
        <p className="text-gray-600 mt-1">
          Here's your delivery overview for today
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Assigned Parcels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiPackage className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Total
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.totalAssigned}
          </h3>
          <p className="text-gray-600 text-sm">Assigned Parcels</p>
        </motion.div>

        {/* In Transit Parcels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FiTruck className="w-6 h-6 text-yellow-500" />
            </div>
            <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2.5 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.inTransitParcels}
          </h3>
          <p className="text-gray-600 text-sm">In Transit</p>
        </motion.div>

        {/* Delivered Today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
              Today
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.todayDeliveries}
          </h3>
          <p className="text-gray-600 text-sm">Delivered Today</p>
        </motion.div>

        {/* Total Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
              Earnings
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            NPR {stats.totalEarnings.toLocaleString()}
          </h3>
          <p className="text-gray-600 text-sm">Total Earnings</p>
        </motion.div>
      </div>

      {/* Recent Deliveries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Deliveries
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Your latest delivery activities
              </p>
            </div>
            <Link
              to="/driver/delivery-history"
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All
              <FiArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>

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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentDeliveries.map((delivery) => (
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
                      <div className="text-sm text-gray-500">
                        {delivery.receiver.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiMapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate max-w-xs">
                        {delivery.receiver.address}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${getStatusColor(
                          delivery.status
                        )}`}
                      >
                        {getStatusIcon(delivery.status)}
                        {delivery.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(delivery.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
              {stats.recentDeliveries.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No recent deliveries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DriverDashboard;
