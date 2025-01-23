import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logoo.png";
import { authAPI } from "../api/apis";
import { FiUser, FiChevronDown } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();

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
    window.location.reload();
  };

  const scrollToSection = (sectionId) => {
    // Close mobile menu if open
    setIsOpen(false);

    // If not on home page, navigate to home page first
    if (location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }

    // If already on home page, scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const getDashboardLink = () => {
    if (!userData) return "/login";
    switch (userData.role) {
      case "admin":
        return "/admin/dashboard";
      case "driver":
        return "/driver/dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <nav className="bg-blue-800 fixed w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <div
              onClick={() => scrollToSection("hero")}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <img src={logo} alt="Logo" className="h-10 w-10" />
              <span className="text-white font-bold text-xl">NepXpress</span>
            </div>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className="flex space-x-8">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-white hover:text-yellow-300 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-white hover:text-yellow-300 transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-white hover:text-yellow-300 transition-colors"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Auth Buttons - Right */}
          <div className="hidden md:flex items-center space-x-4">
            {userData ? (
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-3 text-white focus:outline-none group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center overflow-hidden">
                    {userData?.photo ? (
                      <img
                        src={`http://localhost:5000${userData.photo}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "";
                          e.target.onerror = null;
                          e.target.parentElement.innerHTML = (
                            <FiUser className="h-6 w-6 text-white" />
                          );
                        }}
                      />
                    ) : (
                      <FiUser className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <span className="text-white font-medium">
                    {userData.name}
                  </span>
                  <FiChevronDown className="text-white" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <Link
                      to={getDashboardLink()}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to={`${getDashboardLink()}/profile`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-300 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => scrollToSection("hero")}
              className="block w-full text-left text-white hover:text-yellow-300 px-3 py-2 rounded-md"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="block w-full text-left text-white hover:text-yellow-300 px-3 py-2 rounded-md"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left text-white hover:text-yellow-300 px-3 py-2 rounded-md"
            >
              Contact
            </button>
            {userData ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block text-white hover:text-yellow-300 px-3 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to={`${getDashboardLink()}/profile`}
                  className="block text-white hover:text-yellow-300 px-3 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-400 hover:text-red-300 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
