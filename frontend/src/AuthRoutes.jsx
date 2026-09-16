import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
  const token = localStorage.getItem("token");

  if (token) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role === "company") {
      return <Navigate to="/company" />;
    } else if (user.role === "candidate") {
      return <Navigate to="/candidate" />;
    }
  }

  return <Outlet />;
};

export default AuthRoutes;