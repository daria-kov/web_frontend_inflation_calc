
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import CategoryCard from "../components/CategoryCard";
import DateFilter from "../components/DateFilter";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  deleteCategory,
  fetchCategories,
  setSelectedDate,
} from "../features/categories/categoriesSlice";
import { getMediaUrl } from "../shared/media";
import type { Category } from "../App";

function GridPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    categories,
    loading,
    error,
    deletingIds,
    deleteError,
    selectedDate,
  } = useAppSelector((state) => state.categories);

  const { isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  // Запоминаем дату при открытии страницы,
  // чтобы загрузить публикации с учётом сохранённого фильтра.
  const initialSelectedDate = useRef(selectedDate);

  useEffect(() => {
    dispatch(
      fetchCategories(initialSelectedDate.current || undefined)
    );
  }, [dispatch]);

  // Преобразуем формат backend в формат карточек
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

  // Загружаем категории с учётом выбранной даты
  const handleApplyFilter = () => {
    dispatch(fetchCategories(selectedDate || undefined));
  };

  // Удаляем публикацию
  const handleDelete = (id: number) => {
    dispatch(deleteCategory(id));
  };

  return (
    <main className="grid-page">
      <DateFilter
        selectedDate={selectedDate}
        onDateChange={(date) => dispatch(setSelectedDate(date))}
        onApply={handleApplyFilter}
      />

      {deleteError && (
        <p className="error-message">{deleteError}</p>
      )}

      <div className="cards">
        {loading === "pending" && (
          <p>Загрузка категорий...</p>
        )}

        {loading === "failed" && (
          <p className="error-message">{error}</p>
        )}

        {loading === "succeeded" &&
          displayedCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onSelect={(id) => navigate(`/?category=${id}`)}
              canDelete={isAuthenticated && category.isCreator}
              isDeleting={deletingIds.includes(category.id)}
              onDelete={handleDelete}
            />
          ))}

        {loading === "succeeded" &&
          displayedCategories.length === 0 && (
            <p className="empty-message">
              На выбранную дату категорий нет.
            </p>
          )}
      </div>
    </main>
  );
}

export default GridPage;
