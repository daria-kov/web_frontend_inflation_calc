
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAppDispatch } from "../app/hooks";
import { setCredentials } from "../features/auth/authSlice";

interface AuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  user: {
    id: number;
    login: string;
    full_name: string;
  };
}

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post<AuthResponse>(
        "/api/users/auth",
        {
          login,
          password,
        }
      );

      const { access_token, user } = response.data;

      // Сохраняем JWT в браузере
      localStorage.setItem("access_token", access_token);

      // Обновляем состояние Redux
      dispatch(setCredentials(user));

      // После входа переходим на главную страницу
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Не удалось войти. Проверьте логин и пароль."
        );
      } else {
        setError("Произошла непредвиденная ошибка.");
      }
    } finally {
      setLoading(false);
    }
  }


    return (
    <main className="login-page">
        <form className="login-form" onSubmit={handleSubmit}>
        <h2>С возвращением!</h2>

        <p className="login-subtitle">
            Войдите, чтобы продолжить работу с мойИПЦ
        </p>

        <div className="mb-3">
            <label htmlFor="login" className="form-label">
            Логин
            </label>

            <input
            id="login"
            type="text"
            className="form-control"
            placeholder="Введите логин"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            required
            />
        </div>

        <div className="mb-3">
            <label htmlFor="password" className="form-label">
            Пароль
            </label>

            <input
            id="password"
            type="password"
            className="form-control"
            placeholder="Введите пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            />
        </div>

        {error && (
            <p className="login-error" role="alert">
            {error}
            </p>
        )}

        <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
        >
            {loading ? "Входим..." : "Войти"}
        </button>
        </form>
    </main>
    );
}

export default LoginPage;
