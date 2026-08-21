// frontend/src/protected.jsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");

  // If not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, allow access to child routes
  return <Outlet />;
};

export default ProtectedRoutes;