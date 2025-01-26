import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logoo.png";
import { authAPI } from "../../api/apis";
import {
  FiGrid,
  FiTruck,
  FiClock,
  FiUser,
  FiLogOut,
  FiBell,
  FiChevronDown,
  FiMenu,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const DriverDashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = authAPI.getCurrentUser();
        if (currentUser) {
          setUserData(currentUser);
        }

        const response = await authAPI.getProfile();
        if (response.status === "success") {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setUserData(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navigation = [
    { name: "Dashboard", href: "/driver/dashboard", icon: <FiGrid /> },
    {
      name: "Assigned Parcels",
      href: "/driver/assigned-parcels",
      icon: <FiTruck />,
    },
    {
      name: "Delivery History",
      href: "/driver/delivery-history",
      icon: <FiClock />,
    },
    { name: "Profile", href: "/driver/profile", icon: <FiUser /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-md text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <FiMenu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center p-6 border-b">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-900">NepXpress</h1>
            <p className="text-sm text-gray-500">Driver Portal</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 px-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                location.pathname === item.href
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 w-full p-4 border-t bg-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
          >
            <FiLogOut className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm h-16 fixed right-0 left-0 lg:left-64 top-0 z-30">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            {/* Left section - Title */}
            <h2 className="text-xl font-semibold text-gray-800 hidden lg:block">
              {navigation.find((item) => item.href === location.pathname)
                ?.name || "Dashboard"}
            </h2>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none"
                >
                  <FiBell className="h-6 w-6" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50"
                    >
                      {notifications.length === 0 ? (
                        <p className="px-4 py-2 text-sm text-gray-500">
                          No new notifications
                        </p>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {notification.message}
                            </p>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    {userData?.photo ? (
                      <img
                        src={`http://localhost:5000${userData.photo}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "";
                          e.target.onerror = null;
                          e.target.parentElement.innerHTML = (
                            <FiUser className="h-6 w-6 text-blue-500" />
                          );
                        }}
                      />
                    ) : (
                      <FiUser className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-gray-900">
                      {userData?.name || "Driver"}
                    </p>
                    <p className="text-xs text-gray-500">{userData?.email}</p>
                  </div>
                  <FiChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
                    >
                      <Link
                        to="/driver/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="pt-24 px-4 lg:px-8 pb-8">{children}</div>
      </div>
    </div>
  );
};

export default DriverDashboardLayout;
