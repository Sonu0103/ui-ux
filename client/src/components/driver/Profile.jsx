import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { authAPI } from "../../api/apis";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiTruck,
  FiCreditCard,
  FiEdit2,
  FiCamera,
  FiSave,
  FiX,
  FiLoader,
  FiAward,
} from "react-icons/fi";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    vehicleNumber: "",
    vehicleType: "Motorcycle",
    licenseNumber: "",
    photo: null,
  });

  useEffect(() => {
    loadDriverProfile();
  }, [navigate]);

  const loadDriverProfile = async () => {
    try {
      setIsLoading(true);
      const currentUser = authAPI.getCurrentUser();
      if (currentUser) {
        setFormData({
          name: currentUser.name || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          address: currentUser.address || "",
          vehicleNumber: currentUser.vehicleNumber || "",
          vehicleType: currentUser.vehicleType || "Motorcycle",
          licenseNumber: currentUser.licenseNumber || "",
          photo: currentUser.photo || null,
        });
      }

      const response = await authAPI.getProfile();
      if (response.status === "success") {
        const userData = response.data.user;
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          vehicleNumber: userData.vehicleNumber || "",
          vehicleType: userData.vehicleType || "Motorcycle",
          licenseNumber: userData.licenseNumber || "",
          photo: userData.photo || null,
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error("Failed to load profile data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        const response = await authAPI.uploadProfilePhoto(file);
        if (response.status === "success") {
          setFormData((prev) => ({
            ...prev,
            photo: response.data.user.photo,
          }));
          toast.success("Profile photo updated successfully!");
        }
      } catch (error) {
        console.error("Photo upload error:", error);
        toast.error("Failed to update profile photo");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await authAPI.updateProfile(formData);
      if (response.status === "success") {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Driver Profile</h1>
            <p className="text-gray-600 mt-1">
              View and manage your profile information
            </p>
          </div>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FiCamera className="w-4 h-4 mr-2" />
              Change Photo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </label>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {isEditing ? (
                <>
                  <FiX className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <FiEdit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Photo and Basic Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-blue-50 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {formData.photo ? (
                  <img
                    src={`http://localhost:5000${formData.photo}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "";
                      e.target.onerror = null;
                      e.target.parentElement.innerHTML = (
                        <FiUser className="w-16 h-16 text-blue-500" />
                      );
                    }}
                  />
                ) : (
                  <FiUser className="w-16 h-16 text-blue-500" />
                )}
              </div>
              {!isEditing && (
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {formData.name}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    {formData.vehicleType} Driver
                  </p>
                </div>
              )}
            </div>

            {/* Contact Information */}
            {!isEditing && (
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FiMail className="w-5 h-5 mr-3" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiPhone className="w-5 h-5 mr-3" />
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="w-5 h-5 mr-3" />
                  <span>{formData.address}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column - Form/Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Number
                    </label>
                    <div className="relative">
                      <FiTruck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.vehicleNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vehicleNumber: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Type
                    </label>
                    <div className="relative">
                      <FiTruck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.vehicleType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vehicleType: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      >
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="Car">Car</option>
                        <option value="Van">Van</option>
                        <option value="Truck">Truck</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Number
                    </label>
                    <div className="relative">
                      <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            licenseNumber: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={isLoading}
                  >
                    <FiSave className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Vehicle Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Vehicle Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-500">
                        Vehicle Type
                      </label>
                      <div className="flex items-center mt-1">
                        <FiTruck className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-900">
                          {formData.vehicleType}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">
                        Vehicle Number
                      </label>
                      <div className="flex items-center mt-1">
                        <FiTruck className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-900">
                          {formData.vehicleNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* License Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    License Information
                  </h3>
                  <div>
                    <label className="text-sm text-gray-500">
                      License Number
                    </label>
                    <div className="flex items-center mt-1">
                      <FiAward className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {formData.licenseNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
