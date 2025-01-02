import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import userService from "../../api/userService";

const CreateParcel = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdParcel, setCreatedParcel] = useState(null);
  const [parcelData, setParcelData] = useState({
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
      dimensions: {
        length: "",
        width: "",
        height: "",
      },
      category: "",
      description: "",
    },
    scheduledPickup: {
      date: "",
      timeSlot: "",
    },
    deliveryType: "",
    amount: 0,
    paymentMethod: "cash_on_delivery",
  });

  const [pricingDetails, setPricingDetails] = useState(null);

  const handleInputChange = (e, section, subsection) => {
    const { name, value } = e.target;
    if (section && subsection) {
      setParcelData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...prev[section][subsection],
            [name]: value,
          },
        },
      }));
    } else if (section) {
      setParcelData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
    } else {
      setParcelData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const calculateCost = async () => {
    try {
      setIsLoading(true);
      const response = await userService.calculateParcelCost({
        weight: parseFloat(parcelData.packageDetails.weight),
        deliveryType: parcelData.deliveryType,
      });

      if (response.status === "success") {
        setPricingDetails(response.data);
        setParcelData((prev) => ({
          ...prev,
          amount: response.data.amount,
        }));
        setStep(4); // Move to payment step
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to calculate cost");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await userService.createParcel(parcelData);
      if (response.status === "success") {
        setCreatedParcel(response.data.parcel);
        setShowSuccess(true);
        toast.success("Parcel created successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create parcel");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToOrders = () => {
    navigate("/dashboard/orders");
  };

  if (showSuccess && createdParcel) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-500"
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
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Parcel Created Successfully!
            </h2>
            <p className="text-gray-600">
              Your parcel has been created with tracking ID:{" "}
              <span className="font-semibold">{createdParcel.trackingId}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Receiver Details</h3>
              <div className="space-y-3">
                <p>
                  <span className="text-gray-600">Name:</span>{" "}
                  {createdParcel.receiver.name}
                </p>
                <p>
                  <span className="text-gray-600">Email:</span>{" "}
                  {createdParcel.receiver.email}
                </p>
                <p>
                  <span className="text-gray-600">Phone:</span>{" "}
                  {createdParcel.receiver.phone}
                </p>
                <p>
                  <span className="text-gray-600">Address:</span>{" "}
                  {createdParcel.receiver.address}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Package Details</h3>
              <div className="space-y-3">
                <p>
                  <span className="text-gray-600">Weight:</span>{" "}
                  {createdParcel.packageDetails.weight} kg
                </p>
                <p>
                  <span className="text-gray-600">Category:</span>{" "}
                  {createdParcel.packageDetails.category}
                </p>
                <p>
                  <span className="text-gray-600">Delivery Type:</span>{" "}
                  {createdParcel.deliveryType}
                </p>
                <p>
                  <span className="text-gray-600">Amount:</span> NPR{" "}
                  {createdParcel.amount}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600">Pickup Address</p>
                <p>{createdParcel.pickupAddress}</p>
              </div>
              <div>
                <p className="text-gray-600">Delivery Address</p>
                <p>{createdParcel.deliveryAddress}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleGoToOrders}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Go to My Orders
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
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
                  name="name"
                  value={parcelData.receiver.name}
                  onChange={(e) => handleInputChange(e, "receiver")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={parcelData.receiver.email}
                  onChange={(e) => handleInputChange(e, "receiver")}
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
                  name="phone"
                  value={parcelData.receiver.phone}
                  onChange={(e) => handleInputChange(e, "receiver")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={parcelData.receiver.address}
                  onChange={(e) => handleInputChange(e, "receiver")}
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
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Package Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={parcelData.packageDetails.weight}
                  onChange={(e) => handleInputChange(e, "packageDetails")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={parcelData.packageDetails.category}
                  onChange={(e) => handleInputChange(e, "packageDetails")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Category</option>
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
                  name="description"
                  value={parcelData.packageDetails.description}
                  onChange={(e) => handleInputChange(e, "packageDetails")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Pickup & Delivery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Address
                </label>
                <textarea
                  name="pickupAddress"
                  value={parcelData.pickupAddress}
                  onChange={handleInputChange}
                  rows={3}
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
                  value={parcelData.deliveryAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={parcelData.scheduledPickup.date}
                  onChange={(e) => handleInputChange(e, "scheduledPickup")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Slot
                </label>
                <select
                  name="timeSlot"
                  value={parcelData.scheduledPickup.timeSlot}
                  onChange={(e) => handleInputChange(e, "scheduledPickup")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Time Slot</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
                  <option value="evening">Evening (3 PM - 6 PM)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Type
                </label>
                <select
                  name="deliveryType"
                  value={parcelData.deliveryType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="standard">Standard Delivery</option>
                  <option value="express">Express Delivery</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
            {pricingDetails && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Selected Plan: {pricingDetails.pricingPlan.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Delivery Time: {pricingDetails.pricingPlan.deliveryTime}
                  </p>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Features:</p>
                    <ul className="list-disc list-inside">
                      {pricingDetails.pricingPlan.features.map(
                        (feature, index) => (
                          <li key={index}>{feature}</li>
                        )
                      )}
                    </ul>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm text-gray-600">
                      Base Price: NPR {pricingDetails.pricingPlan.basePrice}
                    </p>
                    {parcelData.deliveryType === "express" && (
                      <p className="text-sm text-gray-600">
                        Express Delivery: +50%
                      </p>
                    )}
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      Total Amount: NPR {pricingDetails.amount}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={parcelData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="cash_on_delivery">Cash on Delivery</option>
                    <option value="online_payment">Online Payment</option>
                  </select>
                </div>
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New Parcel</h1>
        <div className="mt-4 flex gap-2">
          {[
            "Receiver Details",
            "Package Details",
            "Pickup & Delivery",
            "Payment",
          ].map((label, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full ${
                index + 1 <= step ? "bg-blue-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={step === 4 ? handleSubmit : (e) => e.preventDefault()}>
        {renderStep()}

        <div className="mt-6 flex justify-end space-x-4">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              onClick={
                step === 3 ? calculateCost : () => setStep((prev) => prev + 1)
              }
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={isLoading}
            >
              {step === 3 ? "Calculate Cost" : "Next"}
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Parcel"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateParcel;
