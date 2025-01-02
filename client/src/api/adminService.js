import api from "./config";

const adminService = {
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

  createPricingPlan: async (planData) => {
    try {
      const response = await api.post("/admin/pricing-plans", planData);
      return response.data;
    } catch (error) {
      console.error("Create pricing plan error:", error);
      throw error;
    }
  },

  updatePricingPlan: async (planId, planData) => {
    try {
      const response = await api.patch(
        `/admin/pricing-plans/${planId}`,
        planData
      );
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

  getDrivers: async () => {
    try {
      const response = await api.get("/admin/drivers");
      return response.data;
    } catch (error) {
      console.error("Get drivers error:", error);
      throw error;
    }
  },

  assignParcelToDriver: async (data) => {
    try {
      const response = await api.post("/admin/assign-parcel", data);
      return response.data;
    } catch (error) {
      console.error("Assign driver error:", error);
      throw error;
    }
  },
};

export default adminService;
