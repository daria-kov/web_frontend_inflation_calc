
import defaultImage from "../assets/default.jpg";
import type { Category } from "../App";

type CategoryCardProps = {
  category: Category;
  onSelect: (id: number) => void;
  canDelete: boolean;
  isDeleting: boolean;
  onDelete: (id: number) => void;
};

function CategoryCard({
  category,
  onSelect,
  canDelete,
  isDeleting,
  onDelete,
}: CategoryCardProps) {
  return (
    <div className="card-wrapper">
      <button
        type="button"
        className="card"
        onClick={() => onSelect(category.id)}
      >
        <img
          src={category.image || defaultImage}
          alt={category.title}
          onError={(event) => {
            const image = event.currentTarget;

            if (image.dataset.fallbackApplied !== "true") {
              image.dataset.fallbackApplied = "true";
              image.src = defaultImage;
            }
          }}
        />

        <div className="card-title">{category.title}</div>

        <div className="card-pills">
          <span className="date-pill">
            {category.date.split("-").reverse().join(".")}
          </span>

          <span className={`like-pill ${category.isLiked ? "is-liked" : ""}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
            {category.likes}
          </span>
        </div>
      </button>

      {canDelete && (
        <button
          type="button"
          className="delete-card-btn"
          onClick={() => onDelete(category.id)}
          disabled={isDeleting}
          aria-label="Удалить публикацию"
          title="Удалить публикацию"
        >
          {isDeleting ? "…" : "×"}
        </button>
      )}
    </div>
  );
}

export default CategoryCard;
