export default function SubcategoryButton({ subcategory, isActive, onClick }) {
  return (
    <li>
      <button
        type="button"
        className={
          !isActive
            ? `text-lg btn btn-link no-underline transition-all hover:bg-gray-100 border-primary/30`
            : `btn btn-primary text-lg transition-all`
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
