import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post("/auth/signup", userData);
      return response.data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
  },

  getProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.patch("/auth/profile", data);
      return response.data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },

  uploadProfilePhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const response = await api.post("/auth/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Upload photo error:", error);
      throw error;
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: async () => {
    try {
      const response = await api.get("/admin/dashboard-stats");
      return response.data;
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      throw error;
    }
  },

  getAllParcels: async () => {
    try {
      const response = await api.get("/admin/parcels");
      return response.data;
    } catch (error) {
      console.error("Get all parcels error:", error);
      throw error;
    }
  },

  updateParcelStatus: async (parcelId, status) => {
    try {
      const response = await api.patch(`/admin/parcels/${parcelId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Update parcel status error:", error);
      throw error;
    }
  },

  updatePaymentStatus: async (parcelId, paymentStatus) => {
    try {
      const response = await api.patch(`/admin/parcels/${parcelId}/payment`, {
        paymentStatus,
      });
      return response.data;
    } catch (error) {
      console.error("Update payment status error:", error);
      throw error;
    }
  },

  deleteParcel: async (parcelId) => {
    try {
      const response = await api.delete(`/admin/parcels/${parcelId}`);
      return response.data;
    } catch (error) {
      console.error("Delete parcel error:", error);
      throw error;
    }
  },

  getAllPricingPlans: async () => {
    try {
      const response = await api.get("/admin/pricing-plans");
      return response.data;
    } catch (error) {
      console.error("Get pricing plans error:", error);
      throw error;
    }
  },

  createPricingPlan: async (data) => {
    try {
      const response = await api.post("/admin/pricing-plans", data);
      return response.data;
    } catch (error) {
      console.error("Create pricing plan error:", error);
      throw error;
    }
  },

  updatePricingPlan: async (planId, data) => {
    try {
      const response = await api.patch(`/admin/pricing-plans/${planId}`, data);
      return response.data;
    } catch (error) {
      console.error("Update pricing plan error:", error);
      throw error;
    }
  },

  deletePricingPlan: async (planId) => {
    try {
      const response = await api.delete(`/admin/pricing-plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error("Delete pricing plan error:", error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get("/admin/users");
      return response.data;
    } catch (error) {
      console.error("Get users error:", error);
      throw error;
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Update user status error:", error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Delete user error:", error);
      throw error;
    }
  },

  assignParcelToDriver: async (data) => {
    try {
      const response = await api.post("/admin/assign-parcel", data);
      return response.data;
    } catch (error) {
      console.error("Assign parcel error:", error);
      throw error;
    }
  },

  getDrivers: async () => {
    try {
      const response = await api.get("/admin/drivers");
      return response.data;
    } catch (error) {
      console.error("Get drivers error:", error);
      throw error;
    }
  },

  getReports: async (dateRange) => {
    try {
      const response = await api.get("/admin/reports", { params: dateRange });
      return response.data;
    } catch (error) {
      console.error("Get reports error:", error);
      throw error;
    }
  },
};

// User APIs
export const userAPI = {
  createParcel: async (parcelData) => {
    try {
      const response = await api.post("/user/parcels", parcelData);
      return response.data;
    } catch (error) {
      console.error("Create parcel error:", error);
      throw error;
    }
  },

  getUserParcels: async () => {
    try {
      const response = await api.get("/user/parcels");
      return response.data;
    } catch (error) {
      console.error("Get user parcels error:", error);
      throw error;
    }
  },

  trackParcel: async (trackingId) => {
    try {
      const response = await api.get(`/user/track/${trackingId}`);
      return response.data;
    } catch (error) {
      console.error("Track parcel error:", error);
      throw error;
    }
  },

  calculateParcelCost: async (data) => {
    try {
      const response = await api.post("/user/parcels/calculate-cost", data);
      return response.data;
    } catch (error) {
      console.error("Calculate cost error:", error);
      throw error;
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await api.get("/user/dashboard-stats");
      return response.data;
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      throw error;
    }
  },

  getPaymentHistory: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await api.get("/user/payments", {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.data.status === "success") {
        return response.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch payment history"
        );
      }
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out. Please try again.");
      }
      console.error("Get payment history error:", error);
      throw error;
    }
  },

  createPayment: async (paymentData) => {
    try {
      const response = await api.post("/user/payments", paymentData);
      return response.data;
    } catch (error) {
      console.error("Create payment error:", error);
      throw error;
    }
  },
};

// Driver APIs
export const driverAPI = {
  getDashboardStats: async () => {
    try {
      const response = await api.get("/driver/dashboard-stats");
      return response.data;
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      throw error;
    }
  },

  getAssignedParcels: async () => {
    try {
      const response = await api.get("/driver/parcels");
      return response.data;
    } catch (error) {
      console.error("Get assigned parcels error:", error);
      throw error;
    }
  },

  updateParcelStatus: async (parcelId, data) => {
    try {
      const response = await api.patch(
        `/driver/parcels/${parcelId}/status`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Update parcel status error:", error);
      throw error;
    }
  },

  updateParcelPayment: async (parcelId) => {
    try {
      const response = await api.patch(`/driver/parcels/${parcelId}/payment`);
      return response.data;
    } catch (error) {
      console.error("Update parcel payment error:", error);
      throw error;
    }
  },

  getDeliveryHistory: async (params) => {
    try {
      const response = await api.get("/driver/delivery-history", { params });
      return response.data;
    } catch (error) {
      console.error("Get delivery history error:", error);
      throw error;
    }
  },
};

export default {
  auth: authAPI,
  admin: adminAPI,
  user: userAPI,
  driver: driverAPI,
};
