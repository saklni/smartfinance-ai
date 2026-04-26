import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // belum login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // role tidak sesuai
  if (role && user.role_id !== role) {
    if (user.role_id === 2) {
      return <Navigate to="/dashboard" replace />;
    }
    if (user.role_id === 1) {
      return <Navigate to="/admin" replace />;
    }
  }

  if (user.role_id === 2 && user.onboarding_completed === false) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}