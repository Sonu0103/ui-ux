import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/logoo.png";
import background from "../../assets/background.jpg";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup data:", formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="relative bg-white p-8 rounded-lg shadow-xl ml-32 w-[650px] max-h-[90vh] overflow-y-auto"
      >
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-16 h-16 mb-3" />
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-base text-gray-600 mt-1">Sign up for free</p>
        </div>

        {/* Form fields - adjust spacing */}
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2.5 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-2.5 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2.5 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Create a password"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-2.5 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm your password"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Sign up as
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-4 py-2.5 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="user">User</option>
              <option value="driver">Driver</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white text-xl font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 mt-6"
        >
          Sign up
        </button>

        {/* Login Link */}
        <div className="text-center text-base mt-4">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in
          </Link>
        </div>
      </motion.form>
    </div>
  );
};

export default Signup;