import api from "./config";

const driverService = {
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
      const response = await api.get("/driver/assigned-parcels");
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

  getDeliveryHistory: async (dateRange) => {
    try {
      const params = new URLSearchParams(dateRange);
      const response = await api.get(`/driver/delivery-history?${params}`);
      return response.data;
    } catch (error) {
      console.error("Get delivery history error:", error);
      throw error;
    }
  },

  updateParcelPayment: async (parcelId, data) => {
    try {
      const response = await api.patch(
        `/driver/parcels/${parcelId}/payment`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Update payment status error:", error);
      throw error;
    }
  },

  getPickedParcels: async () => {
    try {
      const response = await api.get("/driver/picked-parcels");
      return response.data;
    } catch (error) {
      console.error("Get picked parcels error:", error);
      throw error;
    }
  },
};

export default driverService;
