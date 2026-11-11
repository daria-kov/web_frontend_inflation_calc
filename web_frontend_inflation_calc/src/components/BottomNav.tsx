
import { useState } from "react";
import axios from "axios";
import { Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

function BottomNav() {
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      dispatch(logout());
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "/api/users/deauth",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("access_token");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Ошибка выхода из аккаунта:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Navbar as="nav" className="tabbar">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `tab ${isActive ? "active" : ""}`
        }
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M10 8l6 4-6 4z" fill="currentColor" />
        </svg>
        <span>Лента</span>
      </NavLink>

      <NavLink
        to="/add"
        className={({ isActive }) =>
          `tab ${isActive ? "active" : ""}`
        }
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path
            d="M11 6h2v5h5v2h-5v5h-2v-5H6v-2h5z"
            fill="#fff"
          />
        </svg>
        <span>Добавить</span>
      </NavLink>

      <NavLink
        to="/categories"
        className={({ isActive }) =>
          `tab ${isActive ? "active" : ""}`
        }
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 4h3l2.5 12h9L21 8H7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="10" cy="20" r="1.7" fill="currentColor" />
          <circle cx="17" cy="20" r="1.7" fill="currentColor" />
        </svg>
        <span>Моя корзина</span>
      </NavLink>

      {isAuthenticated ? (
        <button
          type="button"
          className="tab tab-button"
          onClick={handleLogout}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path
              d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"
              fill="currentColor"
            />
          </svg>
          <span>{loading ? "Выходим..." : "Выйти"}</span>
        </button>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `tab ${isActive ? "active" : ""}`
          }
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path
              d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"
              fill="currentColor"
            />
          </svg>
          <span>Войти</span>
        </NavLink>
      )}
    </Navbar>
  );
}

export default BottomNav;
