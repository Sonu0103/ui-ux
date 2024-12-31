import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import parcelService from "../../api/parcelService";

const CreateParcel = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    // Sender Details
    senderName: "",
    senderPhone: "",
    pickupAddress: "",

    // Receiver Details
    receiverName: "",
    receiverPhone: "",
    deliveryAddress: "",

    // Parcel Details
    weight: "",
    length: "",
    width: "",
    height: "",
    description: "",
    specialInstructions: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate sender details first
      if (
        !formData.senderName.trim() ||
        !formData.senderPhone.trim() ||
        !formData.pickupAddress.trim()
      ) {
        throw new Error(
          "Please fill in all sender details (Name, Phone, and Address)"
        );
      }

      // Validate receiver details
      if (
        !formData.receiverName.trim() ||
        !formData.receiverPhone.trim() ||
        !formData.deliveryAddress.trim()
      ) {
        throw new Error(
          "Please fill in all receiver details (Name, Phone, and Address)"
        );
      }

      // Validate parcel dimensions with specific messages
      const dimensions = {
        weight: formData.weight,
        length: formData.length,
        width: formData.width,
        height: formData.height,
      };

      const missingDimensions = Object.entries(dimensions)
        .filter(([_, value]) => !value || isNaN(parseFloat(value)))
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

      if (missingDimensions.length > 0) {
        throw new Error(
          `Please fill in the following parcel dimensions: ${missingDimensions.join(
            ", "
          )}`
        );
      }

      const parcelData = {
        senderDetails: {
          name: formData.senderName.trim(),
          phone: formData.senderPhone.trim(),
          address: formData.pickupAddress.trim(),
        },
        receiverDetails: {
          name: formData.receiverName.trim(),
          phone: formData.receiverPhone.trim(),
          address: formData.deliveryAddress.trim(),
        },
        parcelDetails: {
          weight: parseFloat(formData.weight),
          length: parseFloat(formData.length),
          width: parseFloat(formData.width),
          height: parseFloat(formData.height),
          description: formData.description.trim(),
          specialInstructions: formData.specialInstructions.trim(),
        },
        amount: calculateShippingCost(formData),
      };

      const response = await parcelService.createParcel(parcelData);
      if (response.status === "success") {
        toast.success("Parcel created successfully!");
        navigate("/dashboard/payment-method", {
          state: { parcelId: response.data.parcel._id },
        });
      }
    } catch (error) {
      console.error("Create parcel error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create parcel"
      );
    }
  };

  const calculateShippingCost = (formData) => {
    const weightRate = 100; // NPR 100 per kg
    const weight = parseFloat(formData.weight) || 0;

    // Calculate total cost based on weight
    const totalCost = Math.round(weight * weightRate);

    // Ensure minimum charge
    return Math.max(totalCost, 100); // Minimum charge of NPR 100
  };

  const showToast = (message, type) => {
    // You'll need to implement a toast notification system
    // For now, we'll just alert
    alert(message);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Sender Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="senderPhone"
                  value={formData.senderPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Address
                </label>
                <textarea
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Receiver Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="receiverPhone"
                  value={formData.receiverPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Parcel Details</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter weight in kg"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Length (cm)
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter length in cm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Width (cm)
                  </label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter width in cm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter height in cm"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe your parcel contents"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Any special handling instructions"
                />
              </div>

              {/* Estimated Cost Display */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">
                  Estimated Cost
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  NPR {calculateShippingCost(formData)}
                </p>
                <p className="text-sm text-gray-500">
                  Base rate + Weight charge + Volume charge
                </p>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {["Sender Details", "Receiver Details", "Parcel Details"].map(
            (label, index) => (
              <div
                key={label}
                className={`flex items-center ${
                  index < step ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="ml-2">{label}</span>
                {index < 2 && (
                  <div
                    className={`h-1 w-16 mx-4 ${
                      index < step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={step === 2 ? handleSubmit : handleNext}
        className="bg-white p-8 rounded-lg shadow-md"
      >
        {renderStep()}

        <div className="mt-6 flex justify-end space-x-4">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {step === 2 ? "Create Parcel" : "Next"}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default CreateParcel;
