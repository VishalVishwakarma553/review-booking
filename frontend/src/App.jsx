import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./components/ui/ToastProvider";
import Layout from "./components/layout/Layout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminStores from "./pages/admin/Stores";
import AdminUserDetail from "./pages/admin/UserDetail";
import UserStores from "./pages/user/Stores";
import OwnerDashboard from "./pages/owner/Dashboard";
import ChangePassword from "./pages/shared/ChangePassword";

// Protected route guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F0]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#EDD5B3] border-t-[#C8956C] rounded-full animate-spin" />
          <p className="text-sm text-[#A08070]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to role-appropriate home
    if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "OWNER") return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/stores" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Public route guard (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F0]">
        <div className="w-10 h-10 border-4 border-[#EDD5B3] border-t-[#C8956C] rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "OWNER") return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/stores" replace />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    {/* Default redirect */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* Public routes */}
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

    {/* Admin routes */}
    <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminUsers /></ProtectedRoute>} />
    <Route path="/admin/users/:id" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminUserDetail /></ProtectedRoute>} />
    <Route path="/admin/stores" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminStores /></ProtectedRoute>} />

    {/* Normal user routes */}
    <Route path="/stores" element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]}><UserStores /></ProtectedRoute>} />

    {/* Store owner routes */}
    <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={["OWNER"]}><OwnerDashboard /></ProtectedRoute>} />

    {/* Shared routes */}
    <Route path="/change-password" element={<ProtectedRoute allowedRoles={["USER", "OWNER", "ADMIN"]}><ChangePassword /></ProtectedRoute>} />

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
