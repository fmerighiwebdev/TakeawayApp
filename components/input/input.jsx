import React, { forwardRef } from "react";
import styles from "./input.module.css";

const Input = forwardRef(
  ({ label, id, name, error, textarea, required, ...props }, ref) => {

    const Tag = textarea ? "textarea" : "input";
    const cssClasses = error
      ? `${styles.formGroup} ${styles.errorInput}`
      : styles.formGroup;

    return (
      <div className={cssClasses}>
        <label htmlFor={id}>
          {label} {required && <span>*</span>}
        </label>
        <Tag
          id={id}
          name={name}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
