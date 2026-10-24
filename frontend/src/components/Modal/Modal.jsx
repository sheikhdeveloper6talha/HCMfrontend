import { useEffect, useRef } from "react";
import styles from "./Modal.module.css";
import Button from "../Button/Button";

// Dialog with Escape-to-close and focus on open. Use for forms and confirmations.
const Modal = ({ open, title, onClose, children, footer, wide = false }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    ref.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={styles.backdrop} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.dialog} ${wide ? styles.wide : ""}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <header className={styles.head}>
          <h2>{title}</h2>
          <button className={styles.x} onClick={onClose} aria-label="Close dialog">&times;</button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.foot}>{footer}</footer>}
      </div>
    </div>
  );
};

// Ready-made delete / deactivate confirmation
export const ConfirmModal = ({ open, title = "Are you sure?", message, confirmLabel = "Confirm", loading, onConfirm, onClose, danger = true }) => (
  <Modal open={open} title={title} onClose={onClose}
    footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant={danger ? "danger" : "primary"} loading={loading} onClick={onConfirm}>{confirmLabel}</Button></>}>
    <p>{message}</p>
  </Modal>
);
export default Modal;
