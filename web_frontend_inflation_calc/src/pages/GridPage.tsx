
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import DateFilter from "../components/DateFilter";
import type { Category } from "../App";

type GridPageProps = {
  categories: Category[];
};

function GridPage({ categories }: GridPageProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const navigate = useNavigate();

  const filteredCategories = categories.filter(
    (category) =>
      !appliedDate || category.date === appliedDate
  );

  return (
    <main className="grid-page">
      <DateFilter
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onApply={() => setAppliedDate(selectedDate)}
      />

      <div className="cards">
        {filteredCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onSelect={(id) => navigate(`/?category=${id}`)}
          />
        ))}

        {filteredCategories.length === 0 && (
          <p className="empty-message">
            На выбранную дату категорий нет.
          </p>
        )}
      </div>
    </main>
  );
}

export default GridPage;
