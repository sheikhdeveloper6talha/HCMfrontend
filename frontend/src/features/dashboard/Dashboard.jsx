import useAuth from "../../hooks/useAuth";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import HRDashboard from "./HRDashboard/HRDashboard";
import EmployeeDashboard from "./EmployeeDashboard/EmployeeDashboard";

const Dashboard = () => {
  const { role } = useAuth();
  if (role === "admin") return <AdminDashboard />;
  if (role === "hr") return <HRDashboard />;
  return <EmployeeDashboard />;
};
export default Dashboard;
