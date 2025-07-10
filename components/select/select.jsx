import styles from "./select.module.css";
import { forwardRef } from "react";

const Select = forwardRef(({ label, id, options, error, required, ...props }, ref) => {
  options = [{ label: "Seleziona un'opzione", value: "" }, ...options];
  
  const cssClasses = error ? `${styles.formGroup} ${styles.errorInput}` : styles.formGroup;

  return (
    <div className={cssClasses}>
      <label htmlFor={id}>{label} {required && <span>*</span>}</label>
      <select id={id} ref={ref} {...props}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

Select.displayName = "Select";

export default Select;
