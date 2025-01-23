import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { adminAPI } from "../../api/apis";
import {
  FiPackage,
  FiClock,
  FiDollarSign,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiList,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

const PricingPlans = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [stats, setStats] = useState({
    totalPlans: 0,
    averagePrice: 0,
    maxPrice: 0,
    minPrice: 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    deliveryTime: "",
    price: "",
    maxWeight: "",
    features: [],
  });

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    if (plans.length > 0) {
      calculateStats();
    }
  }, [plans]);

  const calculateStats = () => {
    const prices = plans.map((plan) => plan.price);
    setStats({
      totalPlans: plans.length,
      averagePrice: Math.round(
        prices.reduce((a, b) => a + b, 0) / prices.length
      ),
      maxPrice: Math.max(...prices),
      minPrice: Math.min(...prices),
    });
  };

  const loadPlans = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getAllPricingPlans();
      if (response.status === "success") {
        setPlans(response.data.plans);
        toast.success("Pricing plans loaded successfully");
      }
    } catch (error) {
      console.error("Failed to load pricing plans:", error);
      toast.error("Failed to load pricing plans");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Plan name is required";
    if (!formData.deliveryTime.trim())
      errors.deliveryTime = "Delivery time is required";
    if (!formData.price || Number(formData.price) <= 0)
      errors.price = "Price must be greater than 0";
    if (!formData.maxWeight || Number(formData.maxWeight) <= 0)
      errors.maxWeight = "Max weight must be greater than 0";
    if (formData.features.filter((f) => f.trim()).length === 0)
      errors.features = "At least one feature is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }
    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        maxWeight: Number(formData.maxWeight),
        features: formData.features.filter((f) => f.trim()),
      };

      if (editingPlan) {
        await adminAPI.updatePricingPlan(editingPlan._id, data);
        toast.success("Plan updated successfully");
      } else {
        await adminAPI.createPricingPlan(data);
        toast.success("Plan created successfully");
      }

      setIsModalOpen(false);
      setEditingPlan(null);
      resetForm();
      loadPlans();
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (planId) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await adminAPI.deletePricingPlan(planId);
        toast.success("Plan deleted successfully");
        loadPlans();
      } catch (error) {
        console.error("Failed to delete plan:", error);
        toast.error("Failed to delete plan");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      deliveryTime: "",
      price: "",
      maxWeight: "",
      features: [],
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <FiRefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Plans</h1>
          <p className="text-gray-600">
            Manage your delivery service pricing plans
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingPlan(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add New Plan</span>
        </button>
      </motion.div>

      {/* Stats Section with staggered animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Plans</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalPlans}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <FiList className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Price</p>
              <p className="text-2xl font-semibold text-green-600">
                NPR {stats.averagePrice}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <FiDollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Highest Price</p>
              <p className="text-2xl font-semibold text-blue-600">
                NPR {stats.maxPrice}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <FiDollarSign className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Lowest Price</p>
              <p className="text-2xl font-semibold text-yellow-600">
                NPR {stats.minPrice}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <FiDollarSign className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Plans Grid with hover effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
            <FiPackage className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-center mb-4">
              No pricing plans found
            </p>
            <button
              onClick={() => {
                resetForm();
                setEditingPlan(null);
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              <span>Create First Plan</span>
            </button>
          </div>
        ) : (
          plans.map((plan, index) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setFormData({
                          name: plan.name,
                          deliveryTime: plan.deliveryTime,
                          price: plan.price.toString(),
                          maxWeight: plan.maxWeight.toString(),
                          features: plan.features,
                        });
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <FiDollarSign className="w-5 h-5 mr-2" />
                    <p className="text-3xl font-bold text-gray-900">
                      NPR {plan.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiClock className="w-4 h-4 mr-2" />
                    <p>{plan.deliveryTime}</p>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiPackage className="w-4 h-4 mr-2" />
                    <p>Up to {plan.maxWeight} kg</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Features:
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-600"
                      >
                        <FiCheck className="w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Enhanced Modal with form validation */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingPlan ? "Edit Plan" : "Create New Plan"}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        setFormErrors({ ...formErrors, name: null });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g., Standard Delivery"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Time
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryTime}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          deliveryTime: e.target.value,
                        });
                        setFormErrors({ ...formErrors, deliveryTime: null });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.deliveryTime
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., 2-3 business days"
                    />
                    {formErrors.deliveryTime && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.deliveryTime}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (NPR)
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => {
                          setFormData({ ...formData, price: e.target.value });
                          setFormErrors({ ...formErrors, price: null });
                        }}
                        min="0"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.price
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="0"
                      />
                      {formErrors.price && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <FiAlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={formData.maxWeight}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            maxWeight: e.target.value,
                          });
                          setFormErrors({ ...formErrors, maxWeight: null });
                        }}
                        min="0"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.maxWeight
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="0"
                      />
                      {formErrors.maxWeight && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <FiAlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.maxWeight}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Features (one per line)
                    </label>
                    <textarea
                      value={formData.features.join("\n")}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          features: e.target.value.split("\n"),
                        });
                        setFormErrors({ ...formErrors, features: null });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.features
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      rows="4"
                      placeholder="Enter features, one per line"
                    />
                    {formErrors.features && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.features}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setFormErrors({});
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <span>{editingPlan ? "Update Plan" : "Create Plan"}</span>
                      {editingPlan ? (
                        <FiEdit2 className="w-4 h-4" />
                      ) : (
                        <FiPlus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PricingPlans;
