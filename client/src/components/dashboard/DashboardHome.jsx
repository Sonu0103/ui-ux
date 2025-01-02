import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import userService from "../../api/userService";
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
      const response = await userService.getDashboardStats();
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
      color: "bg-blue-500",
    },
    {
      title: "In Transit",
      value: dashboardData.inTransitParcels,
      icon: "🚚",
      trend: "+1",
      color: "bg-yellow-500",
    },
    {
      title: "Delivered",
      value: dashboardData.deliveredParcels,
      icon: "✅",
      trend: "+2",
      color: "bg-green-500",
    },
    {
      title: "Total Spending",
      value: `NPR ${dashboardData.totalSpending}`,
      icon: "💰",
      trend: "+NPR 500",
      color: "bg-purple-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {metric.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {metric.value}
                </h3>
                <p className="text-sm mt-2 text-green-600">
                  {metric.trend} from last month
                </p>
              </div>
              <div className={`${metric.color} text-white p-3 rounded-full`}>
                {metric.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.recentParcels.length > 0 ? (
                dashboardData.recentParcels.map((parcel) => (
                  <tr key={parcel._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {parcel.trackingId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.receiver.name}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.assignedDriver?.name || "Not assigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(parcel.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
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
