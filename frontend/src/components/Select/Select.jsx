import { forwardRef } from "react";
import FormField from "../FormField/FormField";
import styles from "../Input/Input.module.css";

// options: [{ value, label }]
const Select = forwardRef(({ label, error, hint, id, options = [], placeholder = "Select...", className = "", ...rest }, ref) => {
  const selectId = id || `sel-${rest.name}`;
  return (
    <FormField label={label} id={selectId} error={error} hint={hint} className={className}>
      <select id={selectId} ref={ref} className={`${styles.input} ${error ? styles.invalid : ""}`} aria-invalid={Boolean(error)} {...rest}>
        {placeholder !== null && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </FormField>
  );
});
Select.displayName = "Select";
export default Select;
