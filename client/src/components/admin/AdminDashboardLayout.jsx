import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logoo.png";
import authService from "../../api/authService";

const AdminDashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUserData(currentUser);
        }

        const response = await authService.getProfile();
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
    authService.logout();
    navigate("/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { name: "Manage Parcels", href: "/admin/parcels", icon: "📦" },
    { name: "Pricing Plans", href: "/admin/pricing", icon: "💰" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Reports", href: "/admin/reports", icon: "📈" },
    { name: "Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm fixed h-full">
        {/* Logo */}
        <div className="flex items-center p-6 border-b">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="ml-2 text-xl font-bold text-gray-800">
            NepXpress Admin
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                location.pathname === item.href
                  ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm h-16 fixed right-0 left-64 top-0 z-10">
          <div className="flex justify-end h-full px-6">
            {/* Profile Dropdown */}
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-2"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {userData?.photo ? (
                      <img
                        src={`http://localhost:5000${userData.photo}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Profile image load error");
                          e.target.src = "";
                          e.target.onerror = null;
                          e.target.parentElement.innerHTML = "👤";
                        }}
                      />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  {userData && (
                    <span className="text-sm font-medium text-gray-700">
                      {userData.name}
                    </span>
                  )}
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="pt-16 p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
