import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const PaymentMethod = () => {
  const navigate = useNavigate();

  const handleProceed = () => {
    toast.success("Payment method selected!");
    navigate("/dashboard/confirmation");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Choose Your Payment Method
        </h1>

        <div className="max-w-md mx-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💵</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cash on Delivery (COD)
                </h3>
                <p className="text-gray-600">
                  Pay when the parcel is delivered
                </p>
              </div>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProceed}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg mt-8 hover:bg-blue-700 transition-colors"
          >
            Proceed to Confirmation
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentMethod;
