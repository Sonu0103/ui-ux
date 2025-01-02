import api from "./config";

const userService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get("/user/dashboard-stats");
      return response.data;
    } catch (error) {
      console.error("Get dashboard stats error:", error);
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

  calculateParcelCost: async (parcelData) => {
    try {
      const response = await api.post(
        "/user/parcels/calculate-cost",
        parcelData
      );
      return response.data;
    } catch (error) {
      console.error("Calculate parcel cost error:", error);
      throw error;
    }
  },

  createParcel: async (parcelData) => {
    try {
      const response = await api.post("/user/parcels", parcelData);
      return response.data;
    } catch (error) {
      console.error("Create parcel error:", error);
      throw error;
    }
  },

  getParcelById: async (id) => {
    try {
      const response = await api.get(`/user/parcels/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get parcel by id error:", error);
      throw error;
    }
  },

  getMyParcels: async () => {
    try {
      const response = await api.get("/user/my-parcels");
      return response.data;
    } catch (error) {
      console.error("Get my parcels error:", error);
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

  getPaymentHistory: async () => {
    try {
      const response = await api.get("/user/payments");
      return response.data;
    } catch (error) {
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

export default userService;
