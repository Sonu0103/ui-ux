import { motion } from "framer-motion";

const DashboardHome = () => {
  const metrics = [
    {
      title: "Total Parcels",
      value: "12",
      icon: "📦",
      trend: "+3",
      color: "bg-blue-500",
    },
    {
      title: "In Transit",
      value: "4",
      icon: "🚚",
      trend: "+1",
      color: "bg-yellow-500",
    },
    {
      title: "Delivered",
      value: "8",
      icon: "✅",
      trend: "+2",
      color: "bg-green-500",
    },
    {
      title: "Total Spent",
      value: "NPR 12,345",
      icon: "💰",
      trend: "+NPR 2,000",
      color: "bg-purple-500",
    },
  ];

  const recentParcels = [
    {
      id: "PAR001",
      from: "Kathmandu",
      to: "Pokhara",
      status: "In Transit",
      date: "2024-03-15",
    },
    {
      id: "PAR002",
      from: "Kathmandu",
      to: "Chitwan",
      status: "Delivered",
      date: "2024-03-14",
    },
    // Add more parcels as needed
  ];

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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parcel ID
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
                  <tr key={parcel.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {parcel.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.from}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.to}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          parcel.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {parcel.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
