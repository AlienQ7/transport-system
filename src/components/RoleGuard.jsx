import { Navigate } from "react-router-dom";

export default function RoleGuard({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If no login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // redirect based on role
    if (role === "staff") return <Navigate to="/bookings" replace />;
    if (role === "driver") return <Navigate to="/driver" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
