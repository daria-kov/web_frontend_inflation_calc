
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import defaultVideo from "../assets/default.mp4";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchCategories,
  toggleCategoryLike,
} from "../features/categories/categoriesSlice";
import { getMediaUrl } from "../shared/media";
import type { Category } from "../App";

function FeedPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const {
    categories,
    loading,
    error,
    likingIds,
    likeError,
    selectedDate,
  } = useAppSelector((state) => state.categories);

  const { isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const currentCategoryId = useRef<number | null>(null);

  // Запоминаем дату фильтра при открытии страницы
  const initialSelectedDate = useRef(selectedDate);

  // Загружаем категории с учётом выбранной даты
  useEffect(() => {
    dispatch(
      fetchCategories(initialSelectedDate.current || undefined)
    );
  }, [dispatch]);

  // Преобразуем ответ backend в формат карточек frontend
  const displayedCategories: Category[] = categories.map((category) => ({
    id: category.id ?? 0,
    title: category.title ?? "",
    description: category.description ?? "",
    date: category.historical_date?.slice(0, 10) ?? "",
    likes: category.likes_count ?? 0,
    isLiked: Number(category.is_liked ?? 0) === 1,
    isCreator: Number(category.is_creator ?? 0) === 1,
    weight: category.basket_weight ?? 0,
    image: getMediaUrl(category.image_url),
    video: getMediaUrl(category.video_url),
  }));

  // Выбираем категорию из URL, если передан её ID
// Выбираем категорию из URL или сохраняем текущую публикацию
useEffect(() => {
  const categoryId = Number(searchParams.get("category"));

  // Если в URL передан ID, сначала пытаемся найти именно эту публикацию
  if (categoryId) {
    const index = categories.findIndex(
      (category) => category.id === categoryId
    );

    if (index >= 0) {
      setCurrentIndex(index);
      currentCategoryId.current = categoryId;
      return;
    }
  }

  // Если URL не задаёт публикацию, восстанавливаем предыдущую по ID
  const previousIndex = categories.findIndex(
    (category) => category.id === currentCategoryId.current
  );

  const nextIndex = previousIndex >= 0 ? previousIndex : 0;

  setCurrentIndex(nextIndex);
  currentCategoryId.current = categories[nextIndex]?.id ?? null;
}, [categories, searchParams]);

  if (loading === "pending" && displayedCategories.length === 0) {
    return <main className="feed">Загрузка ленты...</main>;
  }

  if (loading === "failed") {
    return <main className="feed">{error}</main>;
  }

  if (displayedCategories.length === 0) {
    return <main className="feed">Публикаций пока нет.</main>;
  }

  const category = displayedCategories[currentIndex];

  const isLiked = category.isLiked;
  const isLiking = likingIds.includes(category.id);

  function handleLike() {
    if (!isAuthenticated || isLiking) {
      return;
    }

    dispatch(
      toggleCategoryLike({
        id: category.id,
        like: isLiked ? 0 : 1,
      })
    );
  }

  function nextCategory() {
    const nextIndex =
      (currentIndex + 1) % displayedCategories.length;

    currentCategoryId.current =
      displayedCategories[nextIndex]?.id ?? null;

    setCurrentIndex(nextIndex);
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
            onClick={() => setExpanded((previous) => !previous)}
          >
            {expanded ? "скрыть" : "ещё"}
          </button>
        </div>

        <div className="feed-right">
          <button
            type="button"
            className={`like-btn ${isLiked ? "is-liked" : ""}`}
            onClick={handleLike}
            disabled={!isAuthenticated || isLiking}
            aria-label={
              isLiked ? "Убрать лайк" : "Поставить лайк"
            }
            aria-pressed={isLiked}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {category.likes}
          </button>

          {likeError && (
            <p className="publish-error">{likeError}</p>
          )}

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
