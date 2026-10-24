import Button from "../Button/Button";
import styles from "./Pagination.module.css";

const Pagination = ({ meta, onPage }) => {
  if (!meta || meta.pages <= 1) return null;
  return (
    <nav className={styles.bar} aria-label="Pagination">
      <span className="muted">Page {meta.page} of {meta.pages} ({meta.total} records)</span>
      <div className="row">
        <Button small variant="secondary" disabled={meta.page <= 1} onClick={() => onPage(meta.page - 1)}>Previous</Button>
        <Button small variant="secondary" disabled={meta.page >= meta.pages} onClick={() => onPage(meta.page + 1)}>Next</Button>
      </div>
    </nav>
  );
};
export default Pagination;
