import { useState } from "react";
import { motion } from "framer-motion";
import { userAPI } from "../../api/apis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiTruck, FiDollarSign, FiCheck } from "react-icons/fi";

const CreateParcel = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [formData, setFormData] = useState({
    receiver: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    pickupAddress: "",
    deliveryAddress: "",
    packageDetails: {
      weight: "",
      category: "documents",
      description: "",
    },
    scheduledPickup: {
      date: "",
      timeSlot: "morning",
    },
    deliveryType: "standard",
    amount: 0,
    paymentMethod: "cash_on_delivery",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const calculatePrice = async () => {
    try {
      setIsLoading(true);
      const response = await userAPI.calculateParcelCost({
        weight: formData.packageDetails.weight,
        category: formData.packageDetails.category,
        deliveryType: formData.deliveryType,
      });

      if (response.status === "success") {
        const calculatedAmount = response.data.amount;
        setCalculatedPrice(calculatedAmount);
        // Set the amount in the form data
        setFormData((prev) => ({
          ...prev,
          amount: calculatedAmount,
        }));
        nextStep(); // Move to confirmation step
        toast.success("Price calculated successfully!");
      }
    } catch (error) {
      console.error("Error calculating price:", error);
      toast.error(error.response?.data?.message || "Failed to calculate price");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await userAPI.createParcel({
        receiver: formData.receiver,
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        packageDetails: formData.packageDetails,
        scheduledPickup: formData.scheduledPickup,
        paymentMethod: formData.paymentMethod,
        amount: formData.amount,
        deliveryType: formData.deliveryType,
      });

      if (response.status === "success") {
        toast.success("Parcel created successfully!");
        navigate("/dashboard/orders");
      }
    } catch (error) {
      console.error("Error creating parcel:", error);
      toast.error(error.response?.data?.message || "Failed to create parcel");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Receiver Details" },
    { number: 2, title: "Pickup & Delivery" },
    { number: 3, title: "Package Details" },
    { number: 4, title: "Confirmation" },
  ];

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.number} className="flex-1 relative">
              <div className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step.number
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: currentStep === step.number ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {step.number}
                </motion.div>
                <div className="flex-1">
                  <div
                    className={`h-1 ${
                      index < steps.length - 1
                        ? currentStep > step.number
                          ? "bg-blue-600"
                          : "bg-gray-200"
                        : "hidden"
                    }`}
                  />
                </div>
              </div>
              <p
                className={`mt-2 text-sm font-medium ${
                  currentStep >= step.number ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-sm p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Receiver Details */}
          <motion.div
            initial={{ opacity: 0, x: currentStep === 1 ? 20 : -20 }}
            animate={{ opacity: currentStep === 1 ? 1 : 0, x: 0 }}
            transition={{ duration: 0.5 }}
            className={currentStep === 1 ? "block" : "hidden"}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Receiver Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="receiver.name"
                  value={formData.receiver.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="receiver.email"
                  value={formData.receiver.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="receiver.phone"
                  value={formData.receiver.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="receiver.address"
                  value={formData.receiver.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows="2"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Step 2: Pickup & Delivery */}
          <motion.div
            initial={{ opacity: 0, x: currentStep === 2 ? 20 : -20 }}
            animate={{ opacity: currentStep === 2 ? 1 : 0, x: 0 }}
            transition={{ duration: 0.5 }}
            className={currentStep === 2 ? "block" : "hidden"}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Pickup & Delivery Details
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Address
                </label>
                <textarea
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows="2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows="2"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    name="scheduledPickup.date"
                    value={formData.scheduledPickup.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Time Slot
                  </label>
                  <select
                    name="scheduledPickup.timeSlot"
                    value={formData.scheduledPickup.timeSlot}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
                    <option value="evening">Evening (3 PM - 6 PM)</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3: Package Details */}
          <motion.div
            initial={{ opacity: 0, x: currentStep === 3 ? 20 : -20 }}
            animate={{ opacity: currentStep === 3 ? 1 : 0, x: 0 }}
            transition={{ duration: 0.5 }}
            className={currentStep === 3 ? "block" : "hidden"}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Package Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="packageDetails.weight"
                  value={formData.packageDetails.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  min="0.1"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="packageDetails.category"
                  value={formData.packageDetails.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="documents">Documents</option>
                  <option value="electronics">Electronics</option>
                  <option value="fragile">Fragile</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="packageDetails.description"
                  value={formData.packageDetails.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Type
                </label>
                <select
                  name="deliveryType"
                  value={formData.deliveryType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="standard">Standard Delivery</option>
                  <option value="express">Express Delivery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="cash_on_delivery">Cash on Delivery</option>
                  <option value="online_payment">Online Payment</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Order Confirmation
                </h3>

                <div className="mb-8 bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-700">
                      Total Amount:
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      Rs. {calculatedPrice}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-3">
                      Receiver Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-gray-600">
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        {formData.receiver.name}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span>{" "}
                        {formData.receiver.phone}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {formData.receiver.email}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-3">
                      Package Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-gray-600">
                      <div>
                        <span className="font-medium">Weight:</span>{" "}
                        {formData.packageDetails.weight} kg
                      </div>
                      <div>
                        <span className="font-medium">Category:</span>{" "}
                        {formData.packageDetails.category}
                      </div>
                      <div>
                        <span className="font-medium">Delivery Type:</span>{" "}
                        {formData.deliveryType}
                      </div>
                      <div>
                        <span className="font-medium">Fragile:</span>{" "}
                        {formData.packageDetails.isFragile ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-3">
                      Delivery Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-gray-600">
                      <div>
                        <span className="font-medium">Pickup Address:</span>{" "}
                        {formData.pickupAddress}
                      </div>
                      <div>
                        <span className="font-medium">Delivery Address:</span>{" "}
                        {formData.deliveryAddress}
                      </div>
                      <div>
                        <span className="font-medium">Pickup Date:</span>{" "}
                        {formData.scheduledPickup.date}
                      </div>
                      <div>
                        <span className="font-medium">Time Slot:</span>{" "}
                        {formData.scheduledPickup.timeSlot}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-3">
                      Payment
                    </h4>
                    <div className="text-gray-600">
                      <span className="font-medium">Payment Method:</span>{" "}
                      {formData.paymentMethod}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={prevStep}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
              >
                Next
              </button>
            ) : currentStep === 3 ? (
              <button
                type="button"
                onClick={calculatePrice}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <FiDollarSign className="w-5 h-5" />
                    <span>Calculate Price</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="w-5 h-5" />
                    <span>Confirm & Create</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateParcel;
