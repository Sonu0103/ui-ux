import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    toast.error("Please login to continue");
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
