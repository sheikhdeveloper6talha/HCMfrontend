import styles from "./Button.module.css";

// variant: primary | secondary | danger | ghost. loading disables the button and shows a spinner.
const Button = ({ variant = "primary", loading = false, small = false, children, className = "", disabled, type = "button", ...rest }) => (
  <button
    type={type}
    className={`${styles.btn} ${styles[variant]} ${small ? styles.small : ""} ${className}`}
    disabled={disabled || loading}
    aria-busy={loading}
    {...rest}
  >
    {loading && <span className={styles.spinner} aria-hidden="true" />}
    {children}
  </button>
);
export default Button;
