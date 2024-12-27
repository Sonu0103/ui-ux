import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

const DriverDashboard = () => {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const metrics = [
    {
      title: "Today's Assignments",
      value: "5",
      icon: "🚚",
      trend: "+2",
      color: "bg-blue-500",
    },
    {
      title: "Delivered Today",
      value: "3",
      icon: "✅",
      trend: "+1",
      color: "bg-green-500",
    },
    {
      title: "Today's Earnings",
      value: "NPR 2,500",
      icon: "💰",
      trend: "+NPR 500",
      color: "bg-purple-500",
    },
  ];

  const notifications = [
    {
      id: 1,
      message: "New parcel assigned for delivery to Lalitpur",
      time: "5 minutes ago",
    },
    {
      id: 2,
      message: "Customer confirmed delivery of parcel #PAR123",
      time: "30 minutes ago",
    },
  ];

  // Sample delivery locations
  const deliveryLocations = [
    {
      id: 1,
      location: "Lalitpur",
      coordinates: [27.6588, 85.3247],
      info: "Delivery #PAR123",
    },
    {
      id: 2,
      location: "Bhaktapur",
      coordinates: [27.671, 85.4298],
      info: "Delivery #PAR124",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Driver Dashboard</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
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
                <p className="text-sm text-green-600 mt-2">{metric.trend}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Delivery Map
          </h2>
          <div className="h-[400px] bg-gray-100 rounded-lg">
            {mapReady && (
              <MapContainer
                center={[27.7172, 85.324]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {deliveryLocations.map((location) => (
                  <Marker key={location.id} position={location.coordinates}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold">{location.location}</h3>
                        <p className="text-sm">{location.info}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Notifications
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
              >
                <p className="text-gray-800">{notification.message}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {notification.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
