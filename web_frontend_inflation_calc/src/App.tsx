
import {
  Route,
  Routes,
} from "react-router-dom";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import FeedPage from "./pages/FeedPage";
import GridPage from "./pages/GridPage";
import LoginPage from "./pages/LoginPage";
import AddPage from "./pages/AddPage";

export type Category = {
  id: number;
  title: string;
  description: string;
  date: string;
  likes: number;
  isLiked: boolean;
  isCreator: boolean;
  weight: number;
  image: string;
  video: string;
};

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<FeedPage />} />

        <Route path="/categories" element={<GridPage />}/>

        <Route path="/login" element={<LoginPage />} />

        <Route path="/add" element={<AddPage />} />
      </Routes>

      <BottomNav />
    </>
  );
}

export default App;
