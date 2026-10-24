import styles from "./Alert.module.css";

// type: error | success | info | warning
const Alert = ({ type = "info", children, onClose }) =>
  children ? (
    <div className={`${styles.alert} ${styles[type]}`} role={type === "error" ? "alert" : "status"}>
      <span>{children}</span>
      {onClose && <button className={styles.close} onClick={onClose} aria-label="Dismiss">x</button>}
    </div>
  ) : null;
export default Alert;
