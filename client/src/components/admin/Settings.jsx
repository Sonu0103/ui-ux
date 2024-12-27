import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Settings = () => {
  const [companyDetails, setCompanyDetails] = useState({
    name: "NepXpress",
    address: "Kathmandu, Nepal",
    phone: "+977 1-4123456",
    email: "info@nepxpress.com",
  });

  const [paymentKeys, setPaymentKeys] = useState({
    esewa: "",
    khalti: "",
    paypal: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    pushNotifications: false,
  });

  const handleCompanyUpdate = (e) => {
    e.preventDefault();
    toast.success("Company details updated successfully!");
  };

  const handlePaymentUpdate = (e) => {
    e.preventDefault();
    toast.success("Payment settings updated successfully!");
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

      {/* Company Details Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Company Details
        </h2>
        <form onSubmit={handleCompanyUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companyDetails.name}
                onChange={(e) =>
                  setCompanyDetails({ ...companyDetails, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={companyDetails.address}
                onChange={(e) =>
                  setCompanyDetails({
                    ...companyDetails,
                    address: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={companyDetails.phone}
                onChange={(e) =>
                  setCompanyDetails({
                    ...companyDetails,
                    phone: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={companyDetails.email}
                onChange={(e) =>
                  setCompanyDetails({
                    ...companyDetails,
                    email: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Update Company Details
            </button>
          </div>
        </form>
      </motion.div>

      {/* Payment Integration Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Payment Integration
        </h2>
        <form onSubmit={handlePaymentUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                eSewa API Key
              </label>
              <input
                type="password"
                value={paymentKeys.esewa}
                onChange={(e) =>
                  setPaymentKeys({ ...paymentKeys, esewa: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khalti API Key
              </label>
              <input
                type="password"
                value={paymentKeys.khalti}
                onChange={(e) =>
                  setPaymentKeys({ ...paymentKeys, khalti: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PayPal API Key
              </label>
              <input
                type="password"
                value={paymentKeys.paypal}
                onChange={(e) =>
                  setPaymentKeys({ ...paymentKeys, paypal: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Update Payment Settings
            </button>
          </div>
        </form>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Notification Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Email Notifications
              </h3>
              <p className="text-sm text-gray-500">Receive updates via email</p>
            </div>
            <button
              onClick={() =>
                setNotifications({
                  ...notifications,
                  email: !notifications.email,
                })
              }
              className={`${
                notifications.email ? "bg-blue-600" : "bg-gray-200"
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
            >
              <span
                className={`${
                  notifications.email ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                SMS Notifications
              </h3>
              <p className="text-sm text-gray-500">Receive updates via SMS</p>
            </div>
            <button
              onClick={() =>
                setNotifications({
                  ...notifications,
                  sms: !notifications.sms,
                })
              }
              className={`${
                notifications.sms ? "bg-blue-600" : "bg-gray-200"
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
            >
              <span
                className={`${
                  notifications.sms ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Push Notifications
              </h3>
              <p className="text-sm text-gray-500">
                Receive push notifications
              </p>
            </div>
            <button
              onClick={() =>
                setNotifications({
                  ...notifications,
                  pushNotifications: !notifications.pushNotifications,
                })
              }
              className={`${
                notifications.pushNotifications ? "bg-blue-600" : "bg-gray-200"
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
            >
              <span
                className={`${
                  notifications.pushNotifications
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
              />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
