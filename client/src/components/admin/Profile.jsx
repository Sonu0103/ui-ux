import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import authService from "../../api/authService";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: null,
  });

  useEffect(() => {
    const loadAdminProfile = async () => {
      try {
        setIsLoading(true);
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setFormData({
            name: currentUser.name || "",
            email: currentUser.email || "",
            phone: currentUser.phone || "",
            address: currentUser.address || "",
            photo: currentUser.photo || null,
          });
        }

        const response = await authService.getProfile();
        if (response.status === "success") {
          const userData = response.data.user;
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
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

    loadAdminProfile();
  }, [navigate]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        const response = await authService.uploadProfilePhoto(file);
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
      const response = await authService.updateProfile(formData);
      if (response.status === "success") {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Profile</h1>
          <div className="flex space-x-4">
            <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Change Photo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={isLoading}
              />
            </label>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
              disabled={isLoading}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {formData.photo ? (
              <img
                src={`http://localhost:5000${formData.photo}`}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "";
                  e.target.onerror = null;
                  e.target.parentElement.innerHTML = "👤";
                }}
              />
            ) : (
              <span className="text-4xl">👤</span>
            )}
          </div>
        </div>

        {/* Profile Information */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <p className="mt-1">{formData.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1">{formData.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="mt-1">{formData.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="mt-1">{formData.address || "Not provided"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
