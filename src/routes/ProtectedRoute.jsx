// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // Masih loading data user
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Belum login → redirect ke login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kalau ada pengecekan role dan tidak sesuai
  if (role && user.role_id !== role) {
    // Redirect ke halaman yang sesuai dengan role-nya
    if (user.role_id === 2) {
      return <Navigate to="/dashboard" replace />;
    }
    if (user.role_id === 1) {
      return <Navigate to="/admin" replace />;
    }
  }

  // Semua aman → tampilkan children
  return children;
}