import styles from "./AuthPage.module.css";

// Shared two-panel layout for Login, Setup and Change password
const AuthShell = ({ title, subtitle, children }) => (
  <div className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.logo}><span>H</span> HCM Lite</div>
      <div>
        <h1>People, time and pay in one place.</h1>
        <p>Employees, attendance, leave and payroll for your whole company.</p>
      </div>
      <div className={styles.roles}><span>Admin</span><span>HR</span><span>Employee</span></div>
    </section>
    <section className={styles.panel}>
      <div className={styles.form}>
        <div><h1>{title}</h1>{subtitle && <p className="muted">{subtitle}</p>}</div>
        {children}
      </div>
    </section>
  </div>
);
export default AuthShell;
