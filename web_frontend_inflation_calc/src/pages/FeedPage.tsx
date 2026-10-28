
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import defaultVideo from "../assets/default.mp4";
import type { Category } from "../App";

type FeedPageProps = {
  categories: Category[];
};

function FeedPage({ categories }: FeedPageProps) {
  const [searchParams] = useSearchParams();

  const categoryId = Number(searchParams.get("category"));
  const foundIndex = categories.findIndex(
    (category) => category.id === categoryId
  );
  const initialIndex = foundIndex >= 0 ? foundIndex : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState<number[]>([]);

  const category = categories[currentIndex];
  const isLiked = liked.includes(category.id);
  const likesCount = category.likes + (isLiked ? 1 : 0);

  function toggleLike() {
    setLiked((previous) =>
      previous.includes(category.id)
        ? previous.filter((id) => id !== category.id)
        : [...previous, category.id]
    );
  }

  function nextCategory() {
    setCurrentIndex(
      (previous) => (previous + 1) % categories.length
    );
    setExpanded(false);
  }

  return (
    <main className="feed">
      <video
        key={category.id}
        className="feed-bg"
        autoPlay
        muted
        loop
        playsInline
        src={category.video || defaultVideo}
        onError={(event) => {
          const video = event.currentTarget;

          if (video.dataset.fallbackApplied !== "true") {
            video.dataset.fallbackApplied = "true";
            video.src = defaultVideo;
          }
        }}
      />

      <div className="feed-overlay">
        <div className="feed-left">
          <div className="feed-title">{category.title}</div>
          <div className="feed-category">
            Категория корзины
          </div>

          <div
            className={`feed-desc ${
              expanded ? "feed-desc-expanded" : ""
            }`}
          >
            {category.description}
          </div>

          <button
            className="more-btn"
            onClick={() =>
              setExpanded((previous) => !previous)
            }
          >
            {expanded ? "скрыть" : "ещё"}
          </button>
        </div>

        <div className="feed-right">
          <button
            className={`like-btn ${
              isLiked ? "is-liked" : ""
            }`}
            onClick={toggleLike}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {likesCount}
          </button>

          <div className="feed-meta">
            Данные за
            <b>{category.date.split("-").reverse().join(".")}</b>
          </div>

          <div className="feed-meta">
            Вес
            <b>{category.weight} %</b>
          </div>

          <button
            className="expand-btn"
            onClick={nextCategory}
            aria-label="Следующая публикация"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}

export default FeedPage;
