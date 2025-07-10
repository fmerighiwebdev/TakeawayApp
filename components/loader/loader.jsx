import styles from "./loader.module.css";

export default function Loader({ button, buttonLabel, fullScreen }) {
  if (button) {
    return (
      <div className={`${styles.loaderBtn}`} role="status">
        <span className="visually-hidden">{buttonLabel}</span>
        <div className={styles.inlineSpinner}></div>
      </div>
    );
  }

  return (
    <div className={fullScreen ? styles.loaderFullScreen : styles.loader}>
      <div className={styles.ldsRing}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
