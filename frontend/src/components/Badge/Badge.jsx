import styles from "./Badge.module.css";

const TONES = {
  present: "good", approved: "good", active: "good", finalized: "good",
  late: "warn", half_day: "warn", pending: "warn", draft: "warn", missing_checkout: "warn",
  absent: "bad", rejected: "bad", inactive: "bad", cancelled: "bad",
  on_leave: "info", off_day: "neutral", upcoming: "neutral", none: "neutral",
};
const Badge = ({ status, children }) => (
  <span className={`${styles.badge} ${styles[TONES[status] || "neutral"]}`}>{children || String(status).replace(/_/g, " ")}</span>
);
export default Badge;
