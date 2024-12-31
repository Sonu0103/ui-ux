import api from "./config";

const parcelService = {
  createParcel: async (parcelData) => {
    try {
      const response = await api.post("/parcels", parcelData);
      return response.data;
    } catch (error) {
      console.error("Create parcel error:", error);
      throw error;
    }
  },

  getUserParcels: async () => {
    try {
      const response = await api.get("/parcels");
      return response.data;
    } catch (error) {
      console.error("Get parcels error:", error);
      throw error;
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await api.get("/parcels/dashboard-stats");
      return response.data;
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      throw error;
    }
  },

  getParcelById: async (id) => {
    try {
      const response = await api.get(`/parcels/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get parcel error:", error);
      throw error;
    }
  },

  confirmPayment: async (parcelId) => {
    try {
      const response = await api.patch(`/parcels/${parcelId}/confirm-payment`);
      return response.data;
    } catch (error) {
      console.error("Confirm payment error:", error);
      throw error;
    }
  },

  getPaymentHistory: async () => {
    try {
      const response = await api.get("/parcels/payment-history");
      return response.data;
    } catch (error) {
      console.error("Get payment history error:", error);
      throw error;
    }
  },

  trackParcel: async (trackingId) => {
    try {
      const response = await api.get(`/parcels/track/${trackingId}`);
      return response.data;
    } catch (error) {
      console.error("Track parcel error:", error);
      throw error;
    }
  },
};

export default parcelService;
