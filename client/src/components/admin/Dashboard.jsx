import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { adminAPI } from "../../api/apis";
import toast from "react-hot-toast";
import Map from "../common/Map";
import { geocodeAddress } from "../../utils/geocoding";
import {
  FiPackage,
  FiTruck,
  FiClock,
  FiDollarSign,
  FiPlus,
  FiUsers,
  FiSettings,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalParcels: 0,
    inTransitParcels: 0,
    deliveredParcels: 0,
    pendingParcels: 0,
    totalRevenue: 0,
    recentParcels: [],
  });
  const [mapMarkers, setMapMarkers] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (dashboardData?.recentParcels?.length > 0) {
      updateMapMarkers();
    }
  }, [dashboardData]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getDashboardStats();
      if (response.status === "success") {
        setDashboardData(response.data);
        toast.success("Dashboard data loaded successfully");
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateMapMarkers = async () => {
    try {
      const markers = await Promise.all(
        dashboardData.recentParcels.map(async (parcel) => {
          const coords = await geocodeAddress(parcel.deliveryAddress);
          if (coords) {
            return {
              ...coords,
              title: `Delivery #${parcel.trackingId}`,
              description: `To: ${parcel.receiver.name}`,
            };
          }
          return null;
        })
      );
      setMapMarkers(markers.filter(Boolean));
    } catch (error) {
      console.error("Error updating map markers:", error);
      toast.error("Failed to update delivery locations");
    }
  };

  const metrics = [
    {
      title: "Total Parcels Delivered",
      value: dashboardData.deliveredParcels || 0,
      icon: <FiPackage className="w-6 h-6" />,
      trend: "+12%",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      link: "/admin/parcels?status=delivered",
    },
    {
      title: "Parcels in Transit",
      value: dashboardData.inTransitParcels || 0,
      icon: <FiTruck className="w-6 h-6" />,
      trend: "+5%",
      color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      link: "/admin/parcels?status=in_transit",
    },
    {
      title: "Pending Orders",
      value: dashboardData.pendingParcels || 0,
      icon: <FiClock className="w-6 h-6" />,
      trend: "-3%",
      color: "bg-gradient-to-r from-red-500 to-red-600",
      link: "/admin/parcels?status=pending",
    },
    {
      title: "Total Revenue",
      value: `NPR ${dashboardData.totalRevenue || 0}`,
      icon: <FiDollarSign className="w-6 h-6" />,
      trend: "+15%",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      link: "/admin/reports",
    },
  ];

  const quickActions = [
    { title: "Manage Parcels", icon: <FiPackage />, link: "/admin/parcels" },
    { title: "Manage Users", icon: <FiUsers />, link: "/admin/users" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-blue-100 mb-4">
          Manage your delivery operations and monitor performance
        </p>
        <div className="flex flex-wrap gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className="flex items-center px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <span className="mr-2">{action.icon}</span>
              {action.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Link key={metric.title} to={metric.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className={`${metric.color} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">{metric.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg">
                    {metric.icon}
                  </div>
                </div>
                <p
                  className={`text-sm mt-2 ${
                    metric.trend.startsWith("+")
                      ? "text-green-100"
                      : "text-red-100"
                  }`}
                >
                  {metric.trend} from last month
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent Parcels */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Parcels
          </h2>
        </div>
        {dashboardData.recentParcels.length > 0 ? (
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
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recentParcels.map((parcel) => (
                  <motion.tr
                    key={parcel._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                      {parcel.trackingId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {parcel.sender.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {parcel.receiver.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
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
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(parcel.createdAt).toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No parcels found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new parcel.
            </p>
            <div className="mt-6">
              <Link
                to="/admin/parcels/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                New Parcel
              </Link>
            </div>
          </div>
        )}

        {/* Map Section */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Delivery Locations
          </h3>
          <div className="h-96 rounded-lg overflow-hidden shadow-inner">
            <Map markers={mapMarkers} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
