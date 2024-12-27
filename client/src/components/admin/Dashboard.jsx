import { motion } from "framer-motion";

const Dashboard = () => {
  const metrics = [
    {
      title: "Total Parcels Delivered",
      value: "1,234",
      icon: "📦",
      trend: "+12%",
      color: "bg-blue-500",
    },
    {
      title: "Parcels in Transit",
      value: "56",
      icon: "🚚",
      trend: "+5%",
      color: "bg-yellow-500",
    },
    {
      title: "Pending Orders",
      value: "23",
      icon: "⏳",
      trend: "-3%",
      color: "bg-red-500",
    },
    {
      title: "Total Revenue",
      value: "NPR 123,456",
      icon: "💰",
      trend: "+15%",
      color: "bg-green-500",
    },
  ];

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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Delivery Trends
          </h3>
          {/* Add Chart.js or other charting library here */}
          <div className="h-64 bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Delivery Trends Chart Placeholder</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Analysis
          </h3>
          {/* Add Chart.js or other charting library here */}
          <div className="h-64 bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Revenue Chart Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
