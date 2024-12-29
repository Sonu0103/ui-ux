import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Login from "./components/auth/Login";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./components/dashboard/DashboardHome";
import CreateParcel from "./components/dashboard/CreateParcel";
import TrackParcel from "./components/dashboard/TrackParcel";
import Orders from "./components/dashboard/Orders";
import PaymentHistory from "./components/dashboard/PaymentHistory";
import Profile from "./components/dashboard/Profile";
import Signup from "./components/auth/Signup";
import { Toaster } from "react-hot-toast";
import AdminDashboardLayout from "./components/admin/AdminDashboardLayout";
import AdminDashboard from "./components/admin/Dashboard";
import ManageParcels from "./components/admin/ManageParcels";
import PricingPlans from "./components/admin/PricingPlans";
import UsersManagement from "./components/admin/UsersManagement";
import Reports from "./components/admin/Reports";
import Settings from "./components/admin/Settings";
import DriverDashboardLayout from "./components/driver/DriverDashboardLayout";
import DriverDashboard from "./components/driver/DriverDashboard";
import AssignedParcels from "./components/driver/AssignedParcels";
import DeliveryHistory from "./components/driver/DeliveryHistory";
import DriverProfile from "./components/driver/Profile";
import DriverSettings from "./components/driver/Settings";
import ForgotPassword from "./components/auth/ForgotPassword";
import PaymentMethod from "./components/dashboard/PaymentMethod";
import ParcelConfirmation from "./components/dashboard/ParcelConfirmation";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>
                <Hero />
                <Features />
                <HowItWorks />
                <Pricing />
                <Contact />
              </main>
              <Footer />
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/create-parcel"
          element={
            <DashboardLayout>
              <CreateParcel />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/track-parcel"
          element={
            <DashboardLayout>
              <TrackParcel />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/orders"
          element={
            <DashboardLayout>
              <Orders />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/payments"
          element={
            <DashboardLayout>
              <PaymentHistory />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/payment-method"
          element={
            <DashboardLayout>
              <PaymentMethod />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/confirmation"
          element={
            <DashboardLayout>
              <ParcelConfirmation />
            </DashboardLayout>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboardLayout>
                <AdminDashboard />
              </AdminDashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/parcels"
          element={
            <AdminDashboardLayout>
              <ManageParcels />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="/admin/pricing"
          element={
            <AdminDashboardLayout>
              <PricingPlans />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminDashboardLayout>
              <UsersManagement />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminDashboardLayout>
              <Reports />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminDashboardLayout>
              <Settings />
            </AdminDashboardLayout>
          }
        />

        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
              <DriverDashboardLayout>
                <DriverDashboard />
              </DriverDashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/assigned-parcels"
          element={
            <DriverDashboardLayout>
              <AssignedParcels />
            </DriverDashboardLayout>
          }
        />
        <Route
          path="/driver/delivery-history"
          element={
            <DriverDashboardLayout>
              <DeliveryHistory />
            </DriverDashboardLayout>
          }
        />
        <Route
          path="/driver/profile"
          element={
            <DriverDashboardLayout>
              <DriverProfile />
            </DriverDashboardLayout>
          }
        />
        <Route
          path="/driver/settings"
          element={
            <DriverDashboardLayout>
              <DriverSettings />
            </DriverDashboardLayout>
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
