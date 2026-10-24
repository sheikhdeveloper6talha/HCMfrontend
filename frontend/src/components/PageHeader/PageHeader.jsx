import styles from "./PageHeader.module.css";

const PageHeader = ({ title, subtitle, children }) => (
  <div className={styles.head}>
    <div>
      <h1>{title}</h1>
      {subtitle && <p className="muted">{subtitle}</p>}
    </div>
    {children && <div className={styles.actions}>{children}</div>}
  </div>
);
export default PageHeader;
