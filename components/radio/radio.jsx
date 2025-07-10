import styles from "./radio.module.css";
import { forwardRef } from "react";

const Radio = forwardRef(({ label, id, name, required, ...props }, ref) => (
  <div className={styles.formGroupFlex}>
    <input id={id} type="radio" name={name} ref={ref} {...props} />
    <label htmlFor={id}>
      <span className={styles.customRadio}></span>
      <div>
        <p>
          {label} {required && <span>*</span>}
        </p>
      </div>
    </label>
  </div>
));

Radio.displayName = "Radio";

export default Radio;