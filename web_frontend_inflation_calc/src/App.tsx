
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import FeedPage from "./pages/FeedPage";
import GridPage from "./pages/GridPage";

import goodsImage from "./assets/goods.jpg";
import goodsVideo from "./assets/goods.mp4";
import clothesImage from "./assets/clothes.jpg";
import clothesVideo from "./assets/clothes.mp4";
import amuzeImage from "./assets/amuzement.jpg";
import amuzeVideo from "./assets/amuzement.mp4";

export type Category = {
  id: number;
  title: string;
  description: string;
  date: string;
  likes: number;
  weight: number;
  image: string;
  video: string;
};

const categories: Category[] = [
  {
    id: 1,
    title: "ПРОДУКТЫ",
    description:
      "Самая тяжелая статья расходов. Включает мясо, молоко, овощи, фрукты и хлебобулочные изделия. Цены на эту категорию растут быстрее всего из-за сезонности и логистики.",
    date: "2026-07-20",
    likes: 7,
    weight: 18.5,
    image: goodsImage,
    video: goodsVideo,
  },
  {
    id: 2,
    title: "ОДЕЖДА И ОБУВЬ",
    description:
      "Сезонные расходы на гардероб. Сюда входят верхняя одежда, обувь и повседневные вещи. Вес категории сильно зависит от времени года.",
    date: "2026-10-18",
    likes: 10,
    weight: 22.3,
    image: clothesImage,
    video: clothesVideo,
  },
  {
    id: 3,
    title: "РАЗВЛЕЧЕНИЯ",
    description:
      "Отдыхать тоже важно, поэтому не забываем о развлечениях: музеи, парки, театры, кафе и кино.",
    date: "2026-01-02",
    likes: 12,
    weight: 12.1,
    image: amuzeImage,
    video: amuzeVideo,
  },
  {
    id: 4,
    title: "НОВАЯ КАТЕГОРИЯ",
    description: "Пока нет описания",
    date: "2026-03-04",
    likes: 1,
    weight: 19,
    image: "",
    video: "",
  },
];

function AppContent() {
  return (
    <>
      <Header />

      <Routes>
        <Route
          path="/"
          element={<FeedPage categories={categories} />}
        />

        <Route
          path="/categories"
          element={<GridPage categories={categories} />}
        />
      </Routes>

      <BottomNav />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
