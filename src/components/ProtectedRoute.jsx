/*import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}) {
  const token =
    localStorage.getItem("token");

  if (!token) {
  return <Navigate to="/login" replace />;
}

  return children;
}
*/
/*import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
*/
//~ /*Tempo*/
//~ import { Navigate } from "react-router-dom";

//~ export default function ProtectedRoute({ children }) {
  //~ const token = localStorage.getItem("token");

  //~ if (!token) {
    //~ return <Navigate to="/login" replace />;
  //~ }

  //~ return children;
//~ }

//~ import { Navigate } from "react-router-dom";

//~ export default function ProtectedRoute({ children }) {
  //~ const token = localStorage.getItem("token");

  //~ if (!token) {
    //~ return <Navigate to="/login" replace />;
  //~ }

  //~ return children;
//~ }
//~ import { Navigate } from "react-router-dom";

//~ export default function ProtectedRoute({ children }) {
  //~ const token = localStorage.getItem("token");
  //~ const role = localStorage.getItem("role");

  //~ // ❌ not logged in
  //~ if (!token) {
    //~ return <Navigate to="/login" replace />;
  //~ }

  //~ // ❌ corrupted session (token exists but no role)
  //~ if (!role) {
    //~ localStorage.removeItem("token");
    //~ return <Navigate to="/login" replace />;
  //~ }

  //~ return children;
//~ }
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!role) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      return <Navigate to="/login" replace />;
    }
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    return <Navigate to="/login" replace />;
  }

  return children;
}
