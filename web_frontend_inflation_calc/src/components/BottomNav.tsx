
import { Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function BottomNav() {
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

      <span className="tab tab-disabled" aria-disabled="true">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path
            d="M11 6h2v5h5v2h-5v5h-2v-5H6v-2h5z"
            fill="#fff"
          />
        </svg>
        <span>Добавить</span>
      </span>

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

      <span className="tab tab-disabled" aria-disabled="true">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path
            d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"
            fill="currentColor"
          />
        </svg>
        <span>Войти</span>
      </span>
    </Navbar>
  );
}

export default BottomNav;
