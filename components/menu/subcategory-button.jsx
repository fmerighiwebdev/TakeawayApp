export default function SubcategoryButton({ subcategory, isActive, onClick }) {
  return (
    <li>
      <button
        type="button"
        className={
          !isActive
            ? `btn btn-link text-md no-underline transition-all hover:bg-gray-100 border-primary/30`
            : `btn btn-primary text-md transition-all`
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
