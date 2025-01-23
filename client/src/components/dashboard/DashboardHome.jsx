import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { userAPI } from "../../api/apis";
import toast from "react-hot-toast";

const DashboardHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalParcels: 0,
    inTransitParcels: 0,
    deliveredParcels: 0,
    pendingParcels: 0,
    totalSpending: 0,
    recentParcels: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await userAPI.getDashboardStats();
      if (response.status === "success") {
        setDashboardData(response.data);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = [
    {
      title: "Total Parcels",
      value: dashboardData.totalParcels,
      icon: "📦",
      trend: "+3",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      link: "/dashboard/orders",
    },
    {
      title: "In Transit",
      value: dashboardData.inTransitParcels,
      icon: "🚚",
      trend: "+1",
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      link: "/dashboard/track-parcel",
    },
    {
      title: "Delivered",
      value: dashboardData.deliveredParcels,
      icon: "✅",
      trend: "+2",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      link: "/dashboard/orders",
    },
    {
      title: "Total Spending",
      value: `NPR ${dashboardData.totalSpending}`,
      icon: "💰",
      trend: "+NPR 500",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      link: "/dashboard/payments",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-blue-100">
          Track your parcels and manage your deliveries
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            to="/dashboard/create-parcel"
            className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create New Parcel
          </Link>
          <Link
            to="/dashboard/track-parcel"
            className="bg-blue-500 text-white hover:bg-blue-400 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Track Parcel
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Link key={index} to={metric.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${metric.color} rounded-2xl p-6 text-white hover:shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 font-medium">{metric.title}</p>
                  <h3 className="text-3xl font-bold mt-2">{metric.value}</h3>
                  <p className="text-sm mt-2 text-white/80">
                    {metric.trend} from last month
                  </p>
                </div>
                <span className="text-3xl">{metric.icon}</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Orders
            </h2>
            <Link
              to="/dashboard/orders"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.recentParcels.length > 0 ? (
                dashboardData.recentParcels.map((parcel) => (
                  <tr key={parcel._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {parcel.trackingId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {parcel.receiver.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {parcel.assignedDriver?.name || "Not assigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(parcel.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/dashboard/track-parcel/${parcel.trackingId}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Track
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No parcels found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
