import styles from "./Card.module.css";

// Content panel
const Card = ({ title, action, children, className = "", flush = false }) => (
  <section className={`${styles.card} ${className}`}>
    {(title || action) && (
      <header className={styles.head}>
        {title && <h2>{title}</h2>}
        {action && <div className={styles.action}>{action}</div>}
      </header>
    )}
    <div className={flush ? styles.flush : styles.body}>{children}</div>
  </section>
);

// Dashboard KPI card
export const StatCard = ({ label, value, hint, tone = "default" }) => (
  <div className={`${styles.stat} ${styles[tone]}`}>
    <span className={styles.statLabel}>{label}</span>
    <strong className={styles.statValue}>{value}</strong>
    {hint && <span className={styles.statHint}>{hint}</span>}
  </div>
);
export default Card;
