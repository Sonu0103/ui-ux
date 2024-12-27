import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";

// Fix for the marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const AssignedParcels = () => {
  const [viewMode, setViewMode] = useState("list"); // "list" or "map"
  const [filterStatus, setFilterStatus] = useState("all");
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const parcels = [
    {
      id: "PAR001",
      sender: "John Doe",
      receiver: "Jane Smith",
      pickupAddress: "Thamel, Kathmandu",
      deliveryAddress: "Patan, Lalitpur",
      status: "pending",
      coordinates: [27.7172, 85.324],
    },
    {
      id: "PAR002",
      sender: "Ram Kumar",
      receiver: "Sita Sharma",
      pickupAddress: "New Road, Kathmandu",
      deliveryAddress: "Bhaktapur Durbar Square",
      status: "in_progress",
      coordinates: [27.7, 85.35],
    },
    // Add more parcels as needed
  ];

  const handleStatusUpdate = (parcelId, newStatus) => {
    toast.success(`Parcel ${parcelId} marked as ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Assigned Parcels
        </h1>
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="delivered">Delivered</option>
          </select>
          <div className="flex rounded-lg border border-gray-300 p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-md ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded-md ${
                viewMode === "map"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Map View
            </button>
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parcel ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receiver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pickup Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parcels.map((parcel) => (
                  <tr key={parcel.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {parcel.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.sender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.receiver}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.pickupAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.deliveryAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          parcel.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : parcel.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {parcel.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {parcel.status === "pending" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(parcel.id, "in_progress")
                          }
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Mark as Picked Up
                        </button>
                      )}
                      {parcel.status === "in_progress" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(parcel.id, "delivered")
                          }
                          className="text-green-600 hover:text-green-900"
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-[600px] bg-gray-100 rounded-lg">
            {mapReady && (
              <MapContainer
                center={[27.7172, 85.324]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {parcels.map((parcel) => (
                  <Marker key={parcel.id} position={parcel.coordinates}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold">{parcel.id}</h3>
                        <p className="text-sm">To: {parcel.receiver}</p>
                        <p className="text-sm">{parcel.deliveryAddress}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedParcels;
