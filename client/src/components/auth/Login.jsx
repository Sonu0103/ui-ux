import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/logoo.png";
import back from "../../assets/back.png";
import authService from "../../api/authService";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(formData);

      if (response.status === "success") {
        toast.success("Login successful!");

        switch (response.data.user.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "driver":
            navigate("/driver/dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-between bg-gradient-to-br from-sky-400 to-sky-400">
      <div className="w-1/2 h-screen flex items-center justify-center pl-20">
        <img
          src={back}
          alt="Delivery"
          className="max-w-full max-h-[80vh] object-contain"
        />
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="relative bg-white p-8 rounded-lg shadow-xl mr-32 w-[650px] max-h-[90vh] overflow-y-auto"
      >
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="w-20 h-20 mb-4" />
          <h2 className="text-4xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-lg text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>

        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Login as
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="user">User</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white text-xl font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Sign in
        </button>

        <div className="flex justify-between text-lg mt-6">
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create new account
          </Link>
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>
      </motion.form>
    </div>
  );
};

export default Login;
