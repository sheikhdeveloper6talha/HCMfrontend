import styles from "./Loader.module.css";

const Loader = ({ full = false, label = "Loading..." }) => (
  <div className={full ? styles.full : styles.inline} role="status">
    <span className={styles.spinner} />
    <span className={styles.label}>{label}</span>
  </div>
);
export default Loader;
