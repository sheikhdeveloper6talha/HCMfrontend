import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// <ProtectedRoute roles={["admin"]} /> wraps child routes. Real security is enforced by the API.
const ProtectedRoute = ({ roles }) => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.mustChangePassword) return <Navigate to="/change-password" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
};
export default ProtectedRoute;
