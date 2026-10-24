import { forwardRef } from "react";
import FormField from "../FormField/FormField";
import styles from "./Input.module.css";

// Works with react-hook-form: <Input label="Email" error={errors.email?.message} {...register("email")} />
const Input = forwardRef(({ label, error, hint, id, type = "text", multiline = false, className = "", ...rest }, ref) => {
  const inputId = id || `in-${rest.name}`;
  const Tag = multiline ? "textarea" : "input";
  return (
    <FormField label={label} id={inputId} error={error} hint={hint} className={className}>
      <Tag id={inputId} ref={ref} type={multiline ? undefined : type} className={`${styles.input} ${error ? styles.invalid : ""}`} aria-invalid={Boolean(error)} {...rest} />
    </FormField>
  );
});
Input.displayName = "Input";
export default Input;
