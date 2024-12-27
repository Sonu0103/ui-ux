import { useState } from "react";
import { motion } from "framer-motion";
import logo from "../../assets/logoo.png";
import back from "../../assets/back.png";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Add your email validation and API call here
    toast.success("OTP sent successfully!");
    setStep(2);
    startResendTimer();
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Add your OTP verification logic here
    toast.success("OTP verified successfully!");
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    // Add your password reset logic here
    toast.success("Password reset successfully!");
    // Redirect to login page
    window.location.href = "/login";
  };

  const startResendTimer = () => {
    setResendDisabled(true);
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="flex flex-col items-center mb-8">
              <img src={logo} alt="Logo" className="w-20 h-20 mb-4" />
              <h2 className="text-4xl font-bold text-gray-800">
                Forgot Password
              </h2>
              <p className="text-lg text-gray-600 mt-2">
                Enter your email to receive OTP
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white text-xl font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Send OTP
            </button>
          </>
        );

      case 2:
        return (
          <>
            <div className="flex flex-col items-center mb-8">
              <img src={logo} alt="Logo" className="w-20 h-20 mb-4" />
              <h2 className="text-4xl font-bold text-gray-800">Verify OTP</h2>
              <p className="text-lg text-gray-600 mt-2">
                Enter the OTP sent to your email
              </p>
            </div>

            <div className="mb-8">
              <div className="flex justify-center space-x-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-16 h-16 text-center text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white text-xl font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 mb-4"
            >
              Verify OTP
            </button>

            <button
              onClick={() => {
                if (!resendDisabled) {
                  startResendTimer();
                  toast.success("OTP resent successfully!");
                }
              }}
              disabled={resendDisabled}
              className={`w-full text-lg font-semibold py-3 rounded-lg ${
                resendDisabled
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {resendDisabled ? `Resend OTP in ${countdown}s` : "Resend OTP"}
            </button>
          </>
        );

      case 3:
        return (
          <>
            <div className="flex flex-col items-center mb-8">
              <img src={logo} alt="Logo" className="w-20 h-20 mb-4" />
              <h2 className="text-4xl font-bold text-gray-800">
                Reset Password
              </h2>
              <p className="text-lg text-gray-600 mt-2">
                Enter your new password
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>

            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white text-xl font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Reset Password
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-between bg-gradient-to-br from-sky-400 to-sky-400">
      <div className="w-1/2 h-screen flex items-center justify-center pl-20">
        <img
          src={back}
          alt="Delivery"
          className="max-w-full max-h-[80vh] object-contain"
        />
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={
          step === 1
            ? handleEmailSubmit
            : step === 2
            ? handleOtpSubmit
            : handleResetPassword
        }
        className="relative bg-white p-8 rounded-lg shadow-xl mr-32 w-[650px] max-h-[90vh] overflow-y-auto"
      >
        {renderStep()}
      </motion.form>
    </div>
  );
};

export default ForgotPassword;
