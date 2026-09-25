import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ClientDashboard from "./pages/client/Dashboard";
import BookTransport from "./pages/client/BookTransport";
import MyOrders from "./pages/client/MyOrders";
import TrackOrder from "./pages/client/TrackOrder";
import OrderDetails from "./pages/client/OrderDetails";
import ClientDocuments from "./pages/client/Documents";
import ClientProfile from "./pages/client/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import OrdersManagement from "./pages/admin/OrdersManagement";
import PaymentVerification from "./pages/admin/PaymentVerification";
import LiveTracking from "./pages/admin/LiveTracking";
import AdminDocuments from "./pages/admin/DocumentManagement";
import Clients from "./pages/admin/Clients";
import AdminProfile from "./pages/admin/Profile";
import AdminOrderDetails from "./pages/admin/OrderDetails";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <Loader label="Loading Aayush Logistics..." />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? (user.role === "admin" ? "/admin/dashboard" : "/client/dashboard") : "/login"} replace />} />
      <Route path="/login" element={user ? <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/client/dashboard"} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/client/dashboard"} replace /> : <Register />} />

      {/* Client routes */}
      <Route path="/client/dashboard" element={<ProtectedRoute allowedRoles={["client"]}><ClientDashboard /></ProtectedRoute>} />
      <Route path="/client/book-transport" element={<ProtectedRoute allowedRoles={["client"]}><BookTransport /></ProtectedRoute>} />
      <Route path="/client/my-orders" element={<ProtectedRoute allowedRoles={["client"]}><MyOrders /></ProtectedRoute>} />
      <Route path="/client/track-order" element={<ProtectedRoute allowedRoles={["client"]}><TrackOrder /></ProtectedRoute>} />
      <Route path="/client/orders/:id" element={<ProtectedRoute allowedRoles={["client"]}><OrderDetails /></ProtectedRoute>} />
      <Route path="/client/documents" element={<ProtectedRoute allowedRoles={["client"]}><ClientDocuments /></ProtectedRoute>} />
      <Route path="/client/profile" element={<ProtectedRoute allowedRoles={["client"]}><ClientProfile /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["admin"]}><OrdersManagement /></ProtectedRoute>} />
      <Route path="/admin/orders/:id" element={<ProtectedRoute allowedRoles={["admin"]}><AdminOrderDetails /></ProtectedRoute>} />
      <Route path="/admin/payment-verification" element={<ProtectedRoute allowedRoles={["admin"]}><PaymentVerification /></ProtectedRoute>} />
      <Route path="/admin/live-tracking" element={<ProtectedRoute allowedRoles={["admin"]}><LiveTracking /></ProtectedRoute>} />
      <Route path="/admin/documents" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDocuments /></ProtectedRoute>} />
      <Route path="/admin/clients" element={<ProtectedRoute allowedRoles={["admin"]}><Clients /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={["admin"]}><AdminProfile /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
