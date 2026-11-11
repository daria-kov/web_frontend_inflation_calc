
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getMediaUrl } from "../shared/media";
import {
  createDraft,
  fetchDraft,
  publishDraft,
} from "../features/categories/categoriesSlice";

function AddPage() {
  const dispatch = useAppDispatch();

  const { isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const {
    draft,
    loadingDraft,
    draftError,
    creating,
    createError,
    publishing,
    publishError,
  } = useAppSelector((state) => state.categories);

  // Данные для создания черновика
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Данные для публикации
  const [description, setDescription] = useState("");
  const [historicalDate, setHistoricalDate] = useState("");
  const [basketWeight, setBasketWeight] = useState("");

  const [published, setPublished] = useState(false);

  // Загружаем черновик после входа пользователя
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDraft());
    }
  }, [dispatch, isAuthenticated]);

  // Предпросмотр выбранного изображения
  useEffect(() => {
    if (!image) {
      setImagePreview(null);
      return;
    }

    const url = URL.createObjectURL(image);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  // Предпросмотр выбранного видео
  useEffect(() => {
    if (!video) {
      setVideoPreview(null);
      return;
    }

    const url = URL.createObjectURL(video);
    setVideoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [video]);

  // Создание черновика
  const handleCreateDraft = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!image || !video) {
      return;
    }

    try {
      await dispatch(
        createDraft({
          title,
          image,
          video,
        })
      ).unwrap();

      setTitle("");
      setImage(null);
      setVideo(null);

      // Получаем созданный черновик с сервера
      await dispatch(fetchDraft()).unwrap();
    } catch (error) {
      console.error("Ошибка создания черновика:", error);
    }
  };

  // Публикация черновика
  const handlePublish = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!draft || draft.id === undefined) {
      console.error("Не найден ID черновика");
      return;
    }

    try {
      await dispatch(
        publishDraft({
          id: draft.id,
          data: {
            description,
            historical_date: historicalDate,
            basket_weight: Number(basketWeight),
          },
        })
      ).unwrap();

      setPublished(true);
    } catch (error) {
      console.error("Ошибка публикации:", error);
    }
  };

  // Пользователь не авторизован
  if (!isAuthenticated) {
    return (
      <main className="add">
        <section className="add-card">
          <h3 className="add-title">Добавить категорию</h3>
          <p>Чтобы добавить категорию, необходимо войти в аккаунт.</p>

          <Link to="/login" className="add-button">
            Войти
          </Link>
        </section>
      </main>
    );
  }

  // Загрузка черновика
  if (loadingDraft) {
    return (
      <main className="add">
        <section className="add-card">
          <p className="add-status">Загрузка...</p>
        </section>
      </main>
    );
  }

  // Настоящая ошибка загрузки черновика
  if (draftError) {
    return (
      <main className="add">
        <section className="add-card">
          <p className="publish-error">{draftError}</p>
        </section>
      </main>
    );
  }

  // Успешная публикация
  if (published) {
    return (
      <main className="add">
        <section className="add-card">
          <h3 className="add-title">Категория опубликована!</h3>
          <p>Теперь она доступна в ленте.</p>

          <Link to="/" className="add-button">
            Перейти в ленту
          </Link>
        </section>
      </main>
    );
  }

  // Если черновик существует — показываем форму публикации
  if (draft) {
    const imageUrl = getMediaUrl(draft.image_url);
    const videoUrl = getMediaUrl(draft.video_url);

    return (
      <main className="add">
        <form className="add-card" onSubmit={handlePublish}>
          <h3 className="add-title">Заполните данные</h3>

          <div className="media-block">
            <div className="media-title">Выбранное фото</div>

            <div className="upload-box media-preview">
              {imageUrl ? (
                <img src={imageUrl} alt={draft.title ?? "Фото категории"} />
              ) : (
                <span>Фото не найдено</span>
              )}
            </div>
          </div>

          <div className="media-block">
            <div className="media-title">Выбранное видео</div>

            <div className="upload-box media-preview">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                />
              ) : (
                <span>Видео не найдено</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category-name">
              Категория корзины
            </label>

            <input
              type="text"
              id="category-name"
              className="form-input"
              value={draft.title ?? ""}
              readOnly
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Описание
            </label>

            <textarea
              id="description"
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Описание"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="historical-date">
                Дата
              </label>

              <input
                type="date"
                id="historical-date"
                className="form-input"
                value={historicalDate}
                onChange={(event) => setHistoricalDate(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="basket-weight">
                Вес (в %)
              </label>

              <input
                type="number"
                id="basket-weight"
                className="form-input"
                placeholder="0"
                min="0.01"
                step="0.01"
                value={basketWeight}
                onChange={(event) => setBasketWeight(event.target.value)}
                required
              />
            </div>
          </div>

          {publishError && (
            <p className="publish-error">{publishError}</p>
          )}

          <button
            type="submit"
            className="add-button"
            disabled={publishing}
          >
            {publishing ? "Публикация..." : "Опубликовать"}
          </button>
        </form>
      </main>
    );
  }

  // Если черновика нет — показываем форму создания
  return (
    <main className="add">
      <form className="add-card" onSubmit={handleCreateDraft}>
        <h3 className="add-title">Заполните данные</h3>

        <div className="media-block">
          <div className="media-title">Загрузить фото</div>

          <label className="upload-box" htmlFor="photo-input">
            {imagePreview ? (
              <img src={imagePreview} alt="Предпросмотр фотографии" />
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="1.5"
                  fill="currentColor"
                />
                <path
                  d="M21 15l-5-5L5 21"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            )}
          </label>

          <input
            type="file"
            id="photo-input"
            accept="image/*"
            hidden
            onChange={(event) =>
              setImage(event.target.files?.[0] ?? null)
            }
          />

          {image && (
            <p className="selected-file">{image.name}</p>
          )}
        </div>

        <div className="media-block">
          <div className="media-title">Загрузить видео</div>

          <label className="upload-box" htmlFor="video-input">
            {videoPreview ? (
              <video
                src={videoPreview}
                muted
                playsInline
              />
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect
                  x="2"
                  y="4"
                  width="15"
                  height="16"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M17 8l5-3v14l-5-3V8z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            )}
          </label>

          <input
            type="file"
            id="video-input"
            accept="video/*"
            hidden
            onChange={(event) =>
              setVideo(event.target.files?.[0] ?? null)
            }
          />

          {video && (
            <p className="selected-file">{video.name}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category-name">
            Категория корзины
          </label>

          <input
            type="text"
            id="category-name"
            className="form-input"
            placeholder="Введите категорию"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        {createError && (
          <p className="publish-error">{createError}</p>
        )}

        <button
          type="submit"
          className="add-button"
          disabled={creating || !image || !video}
        >
          {creating ? "Создание..." : "Далее"}
        </button>
      </form>
    </main>
  );
}

export default AddPage;
