import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Settings = () => {
  const [availability, setAvailability] = useState(true);
  const [notifications, setNotifications] = useState({
    sms: true,
    email: true,
    pushNotifications: false,
  });
  const [workingHours, setWorkingHours] = useState({
    startTime: "09:00",
    endTime: "17:00",
  });
  const [preferredAreas, setPreferredAreas] = useState([
    "Kathmandu",
    "Lalitpur",
    "Bhaktapur",
  ]);
  const [newArea, setNewArea] = useState("");

  const handleAddArea = () => {
    if (newArea.trim() && !preferredAreas.includes(newArea.trim())) {
      setPreferredAreas([...preferredAreas, newArea.trim()]);
      setNewArea("");
      toast.success("Area added successfully!");
    }
  };

  const handleRemoveArea = (area) => {
    setPreferredAreas(preferredAreas.filter((a) => a !== area));
    toast.success("Area removed successfully!");
  };

  const handleSaveWorkingHours = () => {
    toast.success("Working hours updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Availability Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Availability</h2>
            <p className="text-sm text-gray-500">
              Toggle your availability for new deliveries
            </p>
          </div>
          <button
            onClick={() => {
              setAvailability(!availability);
              toast.success(
                `You are now ${
                  !availability ? "available" : "unavailable"
                } for deliveries`
              );
            }}
            className={`${
              availability ? "bg-green-600" : "bg-gray-200"
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
          >
            <span
              className={`${
                availability ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
            />
          </button>
        </div>
      </motion.div>

      {/* Working Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Working Hours
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={workingHours.startTime}
              onChange={(e) =>
                setWorkingHours({ ...workingHours, startTime: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={workingHours.endTime}
              onChange={(e) =>
                setWorkingHours({ ...workingHours, endTime: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <button
          onClick={handleSaveWorkingHours}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Save Working Hours
        </button>
      </motion.div>

      {/* Preferred Areas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Preferred Delivery Areas
        </h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newArea}
            onChange={(e) => setNewArea(e.target.value)}
            placeholder="Add new area"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleAddArea}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {preferredAreas.map((area) => (
            <div
              key={area}
              className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
            >
              <span>{area}</span>
              <button
                onClick={() => handleRemoveArea(area)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Notification Settings
        </h2>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <p className="text-sm text-gray-500">
                  Receive {key.toLowerCase()} notifications
                </p>
              </div>
              <button
                onClick={() => {
                  setNotifications({ ...notifications, [key]: !value });
                  toast.success("Notification settings updated!");
                }}
                className={`${
                  value ? "bg-blue-600" : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    value ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
