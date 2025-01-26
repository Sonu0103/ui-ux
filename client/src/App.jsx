import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/landingpage/Navbar";
import Hero from "./components/landingpage/Hero";
import Features from "./components/landingpage/Features";
import HowItWorks from "./components/landingpage/HowItWorks";
import Pricing from "./components/landingpage/Pricing";
import Contact from "./components/landingpage/Contact";
import Footer from "./components/landingpage/Footer";
import Login from "./components/auth/Login";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./components/dashboard/DashboardHome";
import CreateParcel from "./components/dashboard/CreateParcel";
import TrackParcel from "./components/dashboard/TrackParcel";
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
import ForgotPassword from "./components/auth/ForgotPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MyOrders from "./components/dashboard/MyOrders";

// Landing Page Component
const LandingPage = () => (
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
);

const App = () => (
  <Router>
    <Toaster position="top-right" />
    <Routes>
      {/* Landing Page - Default Route */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

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
          <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout>
              <CreateParcel />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/track-parcel/:trackingId?"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout>
              <TrackParcel />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/orders"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout>
              <MyOrders />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/payments"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout>
              <PaymentHistory />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
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
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardLayout>
              <ManageParcels />
            </AdminDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pricing"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardLayout>
              <PricingPlans />
            </AdminDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardLayout>
              <UsersManagement />
            </AdminDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardLayout>
              <Reports />
            </AdminDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardLayout>
              <Settings />
            </AdminDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardLayout>
              <Profile />
            </AdminDashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Driver Routes */}
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
          <ProtectedRoute allowedRoles={["driver"]}>
            <DriverDashboardLayout>
              <AssignedParcels />
            </DriverDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/delivery-history"
        element={
          <ProtectedRoute allowedRoles={["driver"]}>
            <DriverDashboardLayout>
              <DeliveryHistory />
            </DriverDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/profile"
        element={
          <ProtectedRoute allowedRoles={["driver"]}>
            <DriverDashboardLayout>
              <DriverProfile />
            </DriverDashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all route - Redirect to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default App;
