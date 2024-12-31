import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import parcelService from "../../api/parcelService";
import toast from "react-hot-toast";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalParcels: 0,
    inTransitParcels: 0,
    deliveredParcels: 0,
    totalSpent: 0,
  });
  const [recentParcels, setRecentParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await parcelService.getDashboardStats();
      if (response.status === "success") {
        setStats(response.data.stats);
        setRecentParcels(response.data.recentParcels);
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
      value: stats.totalParcels,
      icon: "📦",
      trend: `${stats.totalParcels > 0 ? "+" : ""}${stats.totalParcels}`,
      color: "bg-blue-500",
    },
    {
      title: "In Transit",
      value: stats.inTransitParcels,
      icon: "🚚",
      trend: `${stats.inTransitParcels > 0 ? "+" : ""}${
        stats.inTransitParcels
      }`,
      color: "bg-yellow-500",
    },
    {
      title: "Delivered",
      value: stats.deliveredParcels,
      icon: "✅",
      trend: `${stats.deliveredParcels > 0 ? "+" : ""}${
        stats.deliveredParcels
      }`,
      color: "bg-green-500",
    },
    {
      title: "Total Spent",
      value: `NPR ${stats.totalSpent}`,
      icon: "💰",
      trend: `NPR ${stats.totalSpent}`,
      color: "bg-purple-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

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
                <p className="text-sm text-green-600 mt-2">
                  {metric.trend} this month
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
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Parcels
          </h2>
          {recentParcels.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To
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
                  {recentParcels.map((parcel) => (
                    <tr key={parcel._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {parcel.trackingId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {parcel.senderDetails.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {parcel.receiverDetails.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            parcel.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {parcel.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(parcel.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No parcels created yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
