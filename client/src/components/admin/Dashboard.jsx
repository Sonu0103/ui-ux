import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import adminService from "../../api/adminService";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalParcels: 0,
    inTransitParcels: 0,
    deliveredParcels: 0,
    pendingParcels: 0,
    totalRevenue: 0,
    recentParcels: [],
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await adminService.getDashboardStats();
        if (response.status === "success") {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const metrics = [
    {
      title: "Total Parcels Delivered",
      value: dashboardData.deliveredParcels || 0,
      icon: "📦",
      trend: "+12%",
      color: "bg-blue-500",
    },
    {
      title: "Parcels in Transit",
      value: dashboardData.inTransitParcels || 0,
      icon: "🚚",
      trend: "+5%",
      color: "bg-yellow-500",
    },
    {
      title: "Pending Orders",
      value: dashboardData.pendingParcels || 0,
      icon: "⏳",
      trend: "-3%",
      color: "bg-red-500",
    },
    {
      title: "Total Revenue",
      value: `NPR ${dashboardData.totalRevenue || 0}`,
      icon: "💰",
      trend: "+15%",
      color: "bg-green-500",
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
      <h1 className="text-2xl font-semibold text-gray-900">
        Dashboard Overview
      </h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {metric.value}
                </h3>
                <p
                  className={`text-sm mt-2 ${
                    metric.trend.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {metric.trend} from last month
                </p>
              </div>
              <div
                className={`${metric.color} text-white p-3 rounded-full text-2xl`}
              >
                {metric.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Parcels */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Parcels</h2>
        {dashboardData.recentParcels.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.recentParcels.map((parcel) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No parcels found</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
