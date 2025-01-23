import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { driverAPI } from "../../api/apis";
import Map from "../common/Map";
import { geocodeAddress } from "../../utils/geocoding";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiMapPin,
  FiPhone,
  FiMail,
  FiDollarSign,
  FiRefreshCw,
  FiFilter,
  FiLoader,
  FiMap,
  FiList,
} from "react-icons/fi";

const AssignedParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadParcels();
  }, []);

  useEffect(() => {
    if (parcels.length > 0) {
      updateMapMarkers();
    }
  }, [parcels]);

  const loadParcels = async () => {
    try {
      setIsLoading(true);
      const response = await driverAPI.getAssignedParcels();
      if (response.status === "success") {
        setParcels(response.data.parcels);
      }
    } catch (error) {
      toast.error("Failed to load parcels");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (parcelId, newStatus) => {
    try {
      setIsUpdating(true);
      const response = await driverAPI.updateParcelStatus(parcelId, {
        status: newStatus,
      });

      if (response.status === "success") {
        toast.success(`Parcel marked as ${newStatus.replace(/_/g, " ")}`);
        await loadParcels(); // Refresh the list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentUpdate = async (parcelId) => {
    try {
      setIsUpdating(true);
      const response = await driverAPI.updateParcelPayment(parcelId);
      if (response.status === "success") {
        // Clear payment history cache
        sessionStorage.removeItem("paymentHistory");
        sessionStorage.removeItem("paymentHistoryTimestamp");

        toast.success("Payment marked as received");
        loadParcels();
      }
    } catch (error) {
      toast.error("Failed to update payment status");
    } finally {
      setIsUpdating(false);
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
        return <FiPackage className="w-4 h-4" />;
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

  const getStatusActions = (parcel) => {
    const baseButtonClasses =
      "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 disabled:opacity-50";

    switch (parcel.status) {
      case "pending":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate(parcel._id, "picked_up")}
              className={`${baseButtonClasses} bg-blue-600 text-white hover:bg-blue-700`}
              disabled={isUpdating}
            >
              <FiPackage className="w-4 h-4 mr-2" />
              Pick Up Parcel
            </button>
          </div>
        );

      case "picked_up":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate(parcel._id, "in_transit")}
              className={`${baseButtonClasses} bg-yellow-600 text-white hover:bg-yellow-700`}
              disabled={isUpdating}
            >
              <FiTruck className="w-4 h-4 mr-2" />
              Start Delivery
            </button>
          </div>
        );

      case "in_transit":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate(parcel._id, "delivered")}
              className={`${baseButtonClasses} bg-green-600 text-white hover:bg-green-700`}
              disabled={isUpdating}
            >
              <FiCheckCircle className="w-4 h-4 mr-2" />
              Mark as Delivered
            </button>
          </div>
        );

      case "delivered":
        if (
          parcel.paymentStatus === "pending" &&
          parcel.paymentMethod === "cash_on_delivery"
        ) {
          return (
            <button
              onClick={() => handlePaymentUpdate(parcel._id)}
              className={`${baseButtonClasses} bg-purple-600 text-white hover:bg-purple-700`}
              disabled={isUpdating}
            >
              <FiDollarSign className="w-4 h-4 mr-2" />
              Mark Payment Received
            </button>
          );
        }
        return (
          <span className="inline-flex items-center text-green-600">
            <FiCheckCircle className="w-4 h-4 mr-2" />
            Completed
          </span>
        );

      default:
        return null;
    }
  };

  const updateMapMarkers = async () => {
    try {
      const markers = await Promise.all(
        parcels.map(async (parcel) => {
          const coords = await geocodeAddress(parcel.deliveryAddress);
          if (coords) {
            return {
              ...coords,
              title: `Delivery to ${parcel.receiver.name}`,
              description: `Address: ${parcel.deliveryAddress}\nStatus: ${parcel.status}`,
              parcel,
            };
          }
          return null;
        })
      );
      setMapMarkers(markers.filter(Boolean));
    } catch (error) {
      console.error("Error updating map markers:", error);
    }
  };

  const filteredParcels = parcels.filter((parcel) => {
    const matchesStatus =
      filterStatus === "all" || parcel.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      parcel.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.receiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const renderParcelList = () => {
    if (filteredParcels.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No parcels found</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {filteredParcels.map((parcel) => (
          <div
            key={parcel._id}
            className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {parcel.trackingId}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusColor(
                      parcel.status
                    )}`}
                  >
                    {getStatusIcon(parcel.status)}
                    <span className="ml-1 capitalize">
                      {parcel.status.replace(/_/g, " ")}
                    </span>
                  </span>
                </div>

                <div className="flex items-start gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {parcel.receiver.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {parcel.deliveryAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Contact</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiPhone className="w-4 h-4" />
                      {parcel.receiver.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiMail className="w-4 h-4" />
                      {parcel.receiver.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">${parcel.amount}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      parcel.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {parcel.paymentStatus}
                  </span>
                </div>
                {getStatusActions(parcel)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-500">Loading parcels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Assigned Parcels
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your delivery assignments
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parcels..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Filter Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="picked_up">Picked Up</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>

            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center px-3 py-1 rounded-md ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiList className="w-4 h-4 mr-2" />
                List
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center px-3 py-1 rounded-md ${
                  viewMode === "map"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiMap className="w-4 h-4 mr-2" />
                Map
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadParcels}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        {viewMode === "list" ? (
          renderParcelList()
        ) : (
          <div className="h-[600px] rounded-lg overflow-hidden">
            <Map markers={mapMarkers} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedParcels;
