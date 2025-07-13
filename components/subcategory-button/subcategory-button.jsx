import styles from "./subcategory-button.module.css";

export default function SubcategoryButton({ subcategory, isActive, onClick }) {
  return (
    <li className={styles.subcategoryItem}>
      <button
        type="button"
        className={
          !isActive
            ? `${styles.subcategoryButton}`
            : `${styles.subcategoryButton} ${styles.active}`
        }
        aria-pressed={isActive}
        aria-label={`Filtra per ${subcategory.name}`}
        onClick={onClick}
      >
        {subcategory.name}
      </button>
    </li>
  );
}
