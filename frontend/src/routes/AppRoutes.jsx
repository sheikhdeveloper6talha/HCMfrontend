import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import AppLayout from "../components/AppLayout/AppLayout";
import useAuth from "../hooks/useAuth";
import Login from "../features/auth/Login/Login";
import Setup from "../features/auth/Setup/Setup";
import ChangePassword from "../features/auth/ChangePassword/ChangePassword";
import Dashboard from "../features/dashboard/Dashboard";
import CompanySettings from "../features/organization/CompanySettings/CompanySettings";
import Departments from "../features/organization/Departments/Departments";
import Designations from "../features/organization/Designations/Designations";
import LeaveTypes from "../features/organization/LeaveTypes/LeaveTypes";
import Holidays from "../features/organization/Holidays/Holidays";
import UserManagement from "../features/users/UserManagement/UserManagement";
import EmployeeList from "../features/employees/EmployeeList/EmployeeList";
import EmployeeForm from "../features/employees/EmployeeForm/EmployeeForm";
import EmployeeDetails from "../features/employees/EmployeeDetails/EmployeeDetails";
import Attendance from "../features/attendance/Attendance";
import Leave from "../features/leave/Leave";
import SalaryStructure from "../features/payroll/SalaryStructure/SalaryStructure";
import PayrollRuns from "../features/payroll/PayrollRuns/PayrollRuns";
import PayrollRunDetail from "../features/payroll/PayrollRuns/PayrollRunDetail";
import Payslips from "../features/payroll/Payslips/Payslips";
import Announcements from "../features/announcements/Announcements";
import Notifications from "../features/notifications/Notifications";
import AuditLog from "../features/audit/AuditLog";

// Change-password needs a login but must stay reachable while a temporary password is active
const NeedsLogin = ({ children }) => (useAuth().isLoggedIn ? children : <Navigate to="/login" replace />);

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/setup" element={<Setup />} />
    <Route path="/change-password" element={<NeedsLogin><ChangePassword /></NeedsLogin>} />

    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/notifications" element={<Notifications />} />

        <Route element={<ProtectedRoute roles={["employee"]} />}>
          <Route path="/profile" element={<EmployeeDetails />} />
          <Route path="/payslips" element={<Payslips />} />
        </Route>

        <Route element={<ProtectedRoute roles={["admin", "hr"]} />}>
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />
          <Route path="/accounts" element={<UserManagement />} />
          <Route path="/salaries" element={<SalaryStructure />} />
          <Route path="/payroll" element={<PayrollRuns />} />
          <Route path="/payroll/:id" element={<PayrollRunDetail />} />
        </Route>

        <Route element={<ProtectedRoute roles={["hr"]} />}>
          <Route path="/employees/new" element={<EmployeeForm />} />
          <Route path="/employees/:id/edit" element={<EmployeeForm />} />
        </Route>

        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/settings" element={<CompanySettings />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/designations" element={<Designations />} />
          <Route path="/leave-types" element={<LeaveTypes />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/audit" element={<AuditLog />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
export default AppRoutes;
