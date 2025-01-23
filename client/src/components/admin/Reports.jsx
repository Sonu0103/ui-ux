import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { adminAPI } from "../../api/apis";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  FiDownload,
  FiCalendar,
  FiTruck,
  FiDollarSign,
  FiPackage,
  FiMapPin,
  FiRefreshCw,
  FiTrendingUp,
  FiClock,
} from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Reports = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [reportData, setReportData] = useState(null);
  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: 0,
    totalDeliveries: 0,
    avgDeliveryTime: 0,
    successRate: 0,
  });

  useEffect(() => {
    loadReports();
  }, [dateRange]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getReports(dateRange);
      if (response.status === "success" && response.data) {
        // Ensure data has the expected structure
        const sanitizedData = {
          revenue: response.data.revenue || [],
          deliveryStats: {
            statusCounts: response.data.deliveryStats?.statusCounts || [],
            deliveryTimes: response.data.deliveryStats?.deliveryTimes || [],
            successRate: response.data.deliveryStats?.successRate || [],
          },
          topDrivers: response.data.topDrivers || [],
          popularAreas: response.data.popularAreas || [],
        };
        setReportData(sanitizedData);
        calculateSummaryStats(sanitizedData);
        toast.success("Reports loaded successfully");
      }
    } catch (error) {
      console.error("Failed to load reports:", error);
      toast.error(error.response?.data?.message || "Failed to load reports");
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSummaryStats = (data) => {
    if (!data || !data.deliveryStats) {
      setSummaryStats({
        totalRevenue: 0,
        totalDeliveries: 0,
        avgDeliveryTime: 0,
        successRate: 0,
      });
      return;
    }

    const totalRevenue = (data.revenue || []).reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );

    const deliveryTimes = data.deliveryStats.deliveryTimes || [];
    const avgDeliveryTime = deliveryTimes.length
      ? deliveryTimes.reduce(
          (sum, item) => sum + (item.avgDeliveryTime || 0),
          0
        ) / deliveryTimes.length
      : 0;

    const successRates = data.deliveryStats.successRate || [];
    const avgSuccessRate = successRates.length
      ? successRates.reduce((sum, item) => sum + (item.rate || 0), 0) /
        successRates.length
      : 0;

    const totalDeliveries = (data.deliveryStats.statusCounts || []).reduce(
      (sum, item) => sum + (item.count || 0),
      0
    );

    setSummaryStats({
      totalRevenue,
      totalDeliveries,
      avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10,
      successRate: Math.round(avgSuccessRate),
    });
  };

  const exportReports = () => {
    // Implementation for exporting reports as CSV
    const csvContent = [
      ["Date", "Revenue", "Deliveries"],
      ...reportData.revenue.map((item) => [
        item._id,
        item.total,
        item.deliveries,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports_${dateRange.startDate}_${dateRange.endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const revenueChartData = {
    labels: reportData?.revenue?.map((item) => item._id) || [],
    datasets: [
      {
        label: "Daily Revenue",
        data: reportData?.revenue?.map((item) => item.total) || [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const deliveryTimeChartData = {
    labels:
      reportData?.deliveryStats?.deliveryTimes?.map((item) => item._id) || [],
    datasets: [
      {
        label: "Average Delivery Time (hours)",
        data:
          reportData?.deliveryStats?.deliveryTimes?.map(
            (item) => item.avgDeliveryTime
          ) || [],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Min Delivery Time",
        data:
          reportData?.deliveryStats?.deliveryTimes?.map(
            (item) => item.minDeliveryTime
          ) || [],
        borderColor: "rgb(59, 130, 246)",
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
      },
      {
        label: "Max Delivery Time",
        data:
          reportData?.deliveryStats?.deliveryTimes?.map(
            (item) => item.maxDeliveryTime
          ) || [],
        borderColor: "rgb(239, 68, 68)",
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const successRateChartData = {
    labels:
      reportData?.deliveryStats?.successRate?.map((item) => item._id) || [],
    datasets: [
      {
        label: "Delivery Success Rate (%)",
        data:
          reportData?.deliveryStats?.successRate?.map((item) => item.rate) ||
          [],
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        displayColors: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += "NPR " + context.parsed.y.toLocaleString();
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "NPR " + value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <FiRefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600">Monitor your business performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
            <FiCalendar className="text-gray-400" />
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="border-none focus:ring-0 p-0 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
            <FiCalendar className="text-gray-400" />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              className="border-none focus:ring-0 p-0 text-sm"
            />
          </div>
          <button
            onClick={loadReports}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            <FiRefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportReports}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={!reportData || isLoading}
          >
            <FiDownload className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                NPR {summaryStats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <FiDollarSign className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Deliveries</p>
              <p className="text-2xl font-semibold text-gray-900">
                {summaryStats.totalDeliveries}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <FiPackage className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Delivery Time</p>
              <p className="text-2xl font-semibold text-gray-900">
                {summaryStats.avgDeliveryTime} hrs
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <FiClock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {summaryStats.successRate}%
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <FiTrendingUp className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Revenue Trend
              </h2>
              <p className="text-sm text-gray-500">Daily revenue analysis</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-full">
              <FiTrendingUp className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="h-[300px]">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Delivery Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Delivery Time Analysis
              </h2>
              <p className="text-sm text-gray-500">
                Average, minimum and maximum delivery times
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-full">
              <FiClock className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="h-[300px]">
            <Line data={deliveryTimeChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Success Rate Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Delivery Success Rate
              </h2>
              <p className="text-sm text-gray-500">Daily success rate trend</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-full">
              <FiTrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="h-[300px]">
            <Line data={successRateChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Top Drivers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Top Performing Drivers
              </h2>
              <p className="text-sm text-gray-500">Based on efficiency score</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-full">
              <FiTruck className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deliveries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Efficiency
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData?.topDrivers.map((driver) => (
                  <tr key={driver._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {driver.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.deliveries}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.round(driver.avgDeliveryTime * 10) / 10} hrs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.round(driver.efficiency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
