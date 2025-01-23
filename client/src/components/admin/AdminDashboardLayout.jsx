import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { authAPI } from "../../api/apis";
import logo from "../../assets/logoo.png";
import {
  FiGrid,
  FiPackage,
  FiDollarSign,
  FiUsers,
  FiPieChart,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

const AdminDashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

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
      toast.error("Failed to load user profile");
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <FiGrid className="w-5 h-5" />,
    },
    {
      name: "Manage Parcels",
      href: "/admin/parcels",
      icon: <FiPackage className="w-5 h-5" />,
    },
    {
      name: "Pricing Plans",
      href: "/admin/pricing",
      icon: <FiDollarSign className="w-5 h-5" />,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: <FiUsers className="w-5 h-5" />,
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: <FiPieChart className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-lg text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          key="sidebar"
          initial={false}
          animate={{ x: 0 }}
          className={`w-64 bg-white shadow-xl fixed h-full z-40 ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center p-6 border-b">
            <img src={logo} alt="Logo" className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              NepXpress Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm h-16 fixed right-0 left-0 lg:left-64 top-0 z-30">
          <div className="flex justify-end h-full px-6">
            {/* Profile Dropdown */}
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden">
                    {userData?.photo ? (
                      <img
                        src={`http://localhost:5000${userData.photo}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Profile image load error");
                          e.target.src = "";
                          e.target.onerror = null;
                          e.target.parentElement.innerHTML = (
                            <FiUser className="w-5 h-5 text-blue-600" />
                          );
                        }}
                      />
                    ) : (
                      <FiUser className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  {userData && (
                    <>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-gray-700">
                          {userData.name}
                        </p>
                        <p className="text-xs text-gray-500">Administrator</p>
                      </div>
                      <FiChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          isProfileDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border"
                    >
                      <Link
                        to="/admin/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FiUser className="w-4 h-4 mr-2" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FiLogOut className="w-4 h-4 mr-2" />
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="pt-16"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
