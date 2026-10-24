import { useSelector } from "react-redux";

const useAuth = () => {
  const { user, token } = useSelector((s) => s.auth);
  return {
    user,
    isLoggedIn: Boolean(token && user),
    role: user?.role,
    isAdmin: user?.role === "admin",
    isHR: user?.role === "hr",
    isEmployee: user?.role === "employee",
  };
};
export default useAuth;
