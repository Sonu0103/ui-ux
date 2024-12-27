import { useState } from "react";

const TrackParcel = () => {
  const [trackingId, setTrackingId] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);

  // Mock tracking data (replace with actual API call)
  const mockTrackingData = {
    id: "PAR001",
    status: "In Transit",
    estimatedDelivery: "2024-03-20",
    currentLocation: "Kathmandu Hub",
    timeline: [
      {
        status: "Order Placed",
        location: "Online",
        timestamp: "2024-03-15 09:00",
        completed: true,
      },
      {
        status: "Picked Up",
        location: "Lalitpur",
        timestamp: "2024-03-15 14:30",
        completed: true,
      },
      {
        status: "In Transit",
        location: "Kathmandu Hub",
        timestamp: "2024-03-16 10:15",
        completed: true,
      },
      {
        status: "Out for Delivery",
        location: "Bhaktapur",
        timestamp: "",
        completed: false,
      },
      {
        status: "Delivered",
        location: "",
        timestamp: "",
        completed: false,
      },
    ],
  };

  const handleTrack = (e) => {
    e.preventDefault();
    // Simulate API call
    setTrackingResult(mockTrackingData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Track Parcel</h1>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <form onSubmit={handleTrack} className="flex gap-4">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter tracking number"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Track
          </button>
        </form>
      </div>

      {/* Tracking Result */}
      {trackingResult && (
        <div className="bg-white rounded-lg shadow p-6">
          {/* Status Overview */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Tracking ID: {trackingResult.id}
                </h2>
                <p className="text-gray-600">
                  Estimated Delivery: {trackingResult.estimatedDelivery}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  trackingResult.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {trackingResult.status}
              </span>
            </div>
            <p className="text-gray-600">
              Current Location: {trackingResult.currentLocation}
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {trackingResult.timeline.map((event, index) => (
              <div
                key={index}
                className={`flex items-start mb-8 last:mb-0 ${
                  !event.completed && "opacity-50"
                }`}
              >
                {/* Timeline Line */}
                {index < trackingResult.timeline.length - 1 && (
                  <div className="absolute w-0.5 bg-gray-200 h-full left-2.5 top-3 -z-10" />
                )}

                {/* Status Dot */}
                <div
                  className={`w-5 h-5 rounded-full flex-shrink-0 mr-4 ${
                    event.completed ? "bg-green-500" : "bg-gray-300"
                  }`}
                />

                {/* Event Details */}
                <div className="flex-1">
                  <h3 className="font-medium">{event.status}</h3>
                  {event.location && (
                    <p className="text-gray-600 text-sm">{event.location}</p>
                  )}
                  {event.timestamp && (
                    <p className="text-gray-500 text-sm">{event.timestamp}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
