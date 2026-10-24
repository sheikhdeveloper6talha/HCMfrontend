import styles from "./FormField.module.css";

// Label + control + validation message together. Pass the same id to the control.
const FormField = ({ label, id, error, hint, children, className = "" }) => (
  <div className={`${styles.field} ${className}`}>
    {label && <label htmlFor={id}>{label}</label>}
    {children}
    {hint && !error && <span className={styles.hint}>{hint}</span>}
    {error && <span className={styles.error} role="alert">{error}</span>}
  </div>
);
export default FormField;
