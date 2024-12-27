import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const PricingPlans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const plans = [
    {
      id: 1,
      name: "Standard Delivery",
      deliveryTime: "3-5 business days",
      price: "NPR 100",
      features: ["Up to 5kg", "Track & Trace", "Basic Insurance"],
      color: "from-blue-500 to-blue-400",
    },
    {
      id: 2,
      name: "Express Delivery",
      deliveryTime: "1-2 business days",
      price: "NPR 200",
      features: ["Up to 10kg", "Priority Handling", "Full Insurance"],
      color: "from-purple-500 to-purple-400",
    },
    {
      id: 3,
      name: "Same Day Delivery",
      deliveryTime: "Within 24 hours",
      price: "NPR 300",
      features: ["Up to 15kg", "Instant Pickup", "Premium Insurance"],
      color: "from-green-500 to-green-400",
    },
  ];

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleSavePlan = () => {
    toast.success("Plan updated successfully!");
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Pricing Plans</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600">{plan.deliveryTime}</p>
              </div>
              <button
                onClick={() => handleEditPlan(plan)}
                className="text-blue-600 hover:text-blue-700"
              >
                Edit Plan
              </button>
            </div>
            <div className={`h-1 bg-gradient-to-r ${plan.color} mb-4`} />
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {plan.price}
              </span>
              <span className="text-gray-600">/parcel</span>
            </div>
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingPlan ? "Edit Plan" : "Add New Plan"}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  defaultValue={editingPlan?.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Time
                </label>
                <input
                  type="text"
                  defaultValue={editingPlan?.deliveryTime}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (NPR)
                </label>
                <input
                  type="text"
                  defaultValue={editingPlan?.price.replace("NPR ", "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (one per line)
                </label>
                <textarea
                  defaultValue={editingPlan?.features.join("\n")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingPlan(null);
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlan}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PricingPlans;
