import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { logout } from "../../features/auth/authSlice";
import { fetchNotifications } from "../../features/notifications/notificationsSlice";
import styles from "./AppLayout.module.css";

// Navigation is filtered by role for convenience only; the API enforces real permissions.
const NAV = [
  { to: "/", label: "Dashboard", roles: ["admin", "hr", "employee"], end: true },
  { to: "/profile", label: "My profile", roles: ["employee"] },
  { to: "/employees", label: "Employees", roles: ["admin", "hr"] },
  { to: "/accounts", label: "Accounts", roles: ["admin", "hr"] },
  { to: "/attendance", label: "Attendance", roles: ["admin", "hr", "employee"] },
  { to: "/leave", label: "Leave", roles: ["admin", "hr", "employee"] },
  { to: "/salaries", label: "Salary structures", roles: ["admin", "hr"] },
  { to: "/payroll", label: "Payroll", roles: ["admin", "hr"] },
  { to: "/payslips", label: "My payslips", roles: ["employee"] },
  { to: "/announcements", label: "Announcements", roles: ["admin", "hr", "employee"] },
  { to: "/notifications", label: "Notifications", roles: ["admin", "hr", "employee"] },
  { group: "Organization", roles: ["admin"] },
  { to: "/settings", label: "Company settings", roles: ["admin"] },
  { to: "/departments", label: "Departments", roles: ["admin"] },
  { to: "/designations", label: "Designations", roles: ["admin"] },
  { to: "/leave-types", label: "Leave types", roles: ["admin"] },
  { to: "/holidays", label: "Holidays", roles: ["admin"] },
  { to: "/audit", label: "Audit log", roles: ["admin"] },
];

const AppLayout = () => {
  const { user, role } = useAuth();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const unread = useSelector((s) => s.notifications.unread);

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    dispatch(fetchNotifications());
    const t = setInterval(() => dispatch(fetchNotifications()), 60000);
    return () => clearInterval(t);
  }, [dispatch]);

  const handleLogout = () => { dispatch(logout()); navigate("/login"); };

  return (
    <div className={styles.shell}>
      <a href="#main" className={styles.skip}>Skip to content</a>
      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`} aria-label="Main navigation">
        <div className={styles.brand}><span className={styles.mark}>H</span> HCM Lite</div>
        <nav className={styles.nav}>
          {NAV.filter((n) => n.roles.includes(role)).map((n) =>
            n.group ? <p key={n.group} className={styles.group}>{n.group}</p> : (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>
                {n.label}
                {n.to === "/notifications" && unread > 0 && <span className={styles.count}>{unread}</span>}
              </NavLink>
            )
          )}
        </nav>
      </aside>
      {open && <div className={styles.scrim} onClick={() => setOpen(false)} />}

      <div className={styles.main}>
        <header className={styles.top}>
          <button className={styles.burger} onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            <span /><span /><span />
          </button>
          <div className={styles.who}>
            <strong>{user.name}</strong>
            <span className="muted">{role === "hr" ? "HR" : role}</span>
          </div>
          <NavLink to="/change-password" className={styles.topLink}>Password</NavLink>
          <button className={styles.logout} onClick={handleLogout}>Log out</button>
        </header>
        <main id="main" className={styles.content}><Outlet /></main>
      </div>
    </div>
  );
};
export default AppLayout;
