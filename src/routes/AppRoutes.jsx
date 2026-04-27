// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

import Landing from "../pages/public/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import UserDashboard from "../pages/user/Dashboard";
import Onboarding from "../pages/user/Onboarding";
import Transactions from "../pages/user/Transactions";
import AdminDashboard from "../pages/admin/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ONBOARDING */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute role={2}>
              <OnboardingGuard />
            </ProtectedRoute>
          }
        />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role={2}>
              <DashboardGuard />
            </ProtectedRoute>
          }
        />

        {/* TRANSACTIONS */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute role={2}>
              <Transactions />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role={1}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// Guard: onboarding hanya untuk yang belum selesai
function OnboardingGuard() {
  const { user } = useAuth();
  return user?.onboarding_completed
    ? <Navigate to="/dashboard" replace />
    : <Onboarding />;
}

// Guard: dashboard hanya untuk yang sudah onboarding
function DashboardGuard() {
  const { user } = useAuth();
  return !user?.onboarding_completed
    ? <Navigate to="/onboarding" replace />
    : <UserDashboard />;
}

export default AppRoutes;
