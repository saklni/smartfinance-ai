import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Landing from "../pages/public/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import UserDashboard from "../pages/user/Dashboard";
import Onboarding from "../pages/user/Onboarding";

import AdminDashboard from "../pages/admin/Dashboard";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  // ✅ ambil user langsung (tanpa useEffect)
  const [user] = useState(() => {
    return JSON.parse(localStorage.getItem("user"));
  });

  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role={2}>
              {user && user.onboarding_completed === false ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <UserDashboard />
              )}
            </ProtectedRoute>
          }
        />

        {/* ONBOARDING */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute role={2}>
              <Onboarding />
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

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;