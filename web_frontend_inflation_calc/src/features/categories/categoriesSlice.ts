import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../shared/api/client";
import type { RootState } from "../../app/store";
import { mockCategories } from "./mockCategories";

// Типы данных

export interface Category {
  id?: number;
  title?: string;
  description?: string;
  status?: string;
  image_url?: string;
  video_url?: string;
  basket_weight?: number;
  historical_date?: string;
  created_at?: string;
  published_at?: string;
  likes_count?: number;
  is_liked?: number;
  is_creator?: number;
}

interface CategoriesState {
  categories: Category[];
  draft: Category | null;
  selectedDate: string;

  // Загрузка публикаций
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;

  // Загрузка черновика
  loadingDraft: boolean;
  draftError: string | null;

  // Создание черновика
  creating: boolean;
  createError: string | null;

  // Публикация черновика
  publishing: boolean;
  publishError: string | null;

  // Лайки
  likingIds: number[];
  likeError: string | null;

  // Удаление публикаций
  deletingIds: number[];
  deleteError: string | null;
}

interface ToggleLikePayload {
  id: number;
  like: 0 | 1;
}

const initialState: CategoriesState = {
  categories: [],
  draft: null,
  selectedDate: "",

  loading: "idle",
  error: null,

  loadingDraft: false,
  draftError: null,

  creating: false,
  createError: null,

  publishing: false,
  publishError: null,

  likingIds: [],
  likeError: null,

  deletingIds: [],
  deleteError: null,
};

// Получение опубликованных публикаций

export const fetchCategories = createAsyncThunk<
  Category[],
  string | undefined,
  { rejectValue: string; state: RootState }
>(
  "categories/fetchCategories",
  async (date, { rejectWithValue, getState }) => {
    try {
      const { isAuthenticated } = getState().auth;
      const token = isAuthenticated
        ? localStorage.getItem("access_token")
        : null;

      const response = await api.api.consumerCategoriesList(
        date ? { date } : {},
        token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {}
      );

      return response.data as Category[];
    } catch (error) {
      const isBackendUnavailable =
        axios.isAxiosError(error) &&
        (
          !error.response ||
          [502, 503, 504].includes(error.response.status)
        );

      if (
        isBackendUnavailable &&
        !axios.isCancel(error) &&
        !getState().auth.isAuthenticated
      ) {
        const filteredMockCategories = date
          ? mockCategories.filter(
              (category) =>
                category.historical_date?.slice(0, 10) === date
            )
          : mockCategories;

        return filteredMockCategories;
      }

      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error ??
            error.response?.data?.message ??
            "Не удалось загрузить публикации"
        );
      }

      return rejectWithValue("Произошла непредвиденная ошибка");
    }
  }
);

// Создание черновика

export const createDraft = createAsyncThunk<
  Category,
  {
    title: string;
    image: File;
    video: File;
  },
  { rejectValue: string }
>(
  "categories/createDraft",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        return rejectWithValue("Необходимо войти в систему");
      }

      const response = await api.api.consumerCategoriesCreate(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data as Category;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error ??
          error.response?.data?.message ??
          "Не удалось создать черновик"
        );
      }

      return rejectWithValue("Произошла непредвиденная ошибка");
    }
  }
);

// Получение черновика пользователя

// Получение черновика пользователя
export const fetchDraft = createAsyncThunk<
  Category | null,
  void,
  { rejectValue: string }
>(
  "categories/fetchDraft",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        return rejectWithValue("Необходимо войти в систему");
      }

      const response = await api.api.consumerCategoriesDraftList({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data as Category;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Отсутствие черновика — нормальная ситуация.
        // Возвращаем null, чтобы показать форму создания.
        if (error.response?.status === 404) {
          return null;
        }

        return rejectWithValue(
          error.response?.data?.error ??
            error.response?.data?.message ??
            "Не удалось загрузить черновик"
        );
      }

      return rejectWithValue("Произошла непредвиденная ошибка");
    }
  }
);

// Публикация черновика

export const publishDraft = createAsyncThunk<
  Category,
  {
    id: number;
    data: {
      description?: string;
      historical_date: string;
      basket_weight: number;
    };
  },
  { rejectValue: string }
>(
  "categories/publishDraft",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        return rejectWithValue("Необходимо войти в систему");
      }

      const response = await api.api.consumerCategoriesPublishUpdate(
        id,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data as Category;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error ??
          error.response?.data?.message ??
          "Не удалось опубликовать запись"
        );
      }

      return rejectWithValue("Произошла непредвиденная ошибка");
    }
  }
);

// Поставить или снять лайк

export const toggleCategoryLike = createAsyncThunk<
  ToggleLikePayload,
  ToggleLikePayload,
  { rejectValue: string; state: RootState }
>(
  "categories/toggleLike",
  async (data, { rejectWithValue, getState }) => {
    const { isAuthenticated } = getState().auth;

    if (!isAuthenticated) {
      return rejectWithValue(
        "Для оценки публикации необходимо войти"
      );
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      return rejectWithValue(
        "Не найден токен авторизации. Войдите повторно."
      );
    }

    try {
      await api.api.consumerCategoriesLikeCreate(
        data.id,
        { like: data.like },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error ??
            error.response?.data?.message ??
            "Не удалось изменить лайк"
        );
      }

      return rejectWithValue("Произошла непредвиденная ошибка");
    }
  }
);

// Удаление публикации

export const deleteCategory = createAsyncThunk<
  number,
  number,
  { rejectValue: string; state: RootState }
>(
  "categories/deleteCategory",
  async (id, { rejectWithValue, getState }) => {
    const { isAuthenticated } = getState().auth;

    if (!isAuthenticated) {
      return rejectWithValue("Для удаления публикации необходимо войти");
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      return rejectWithValue(
        "Не найден токен авторизации. Войдите повторно."
      );
    }

    try {
      await api.api.consumerCategoriesDelete(id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error ??
            error.response?.data?.message ??
            "Не удалось удалить публикацию"
        );
      }

      return rejectWithValue("Произошла непредвиденная ошибка");
    }
  }
);

// Redux Slice

const categoriesSlice = createSlice({
  name: "categories",
  initialState,

  reducers: {
    clearDraft: (state) => {
      state.draft = null;
    },

    clearLikeError: (state) => {
      state.likeError = null;
    },

    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },

    clearSelectedDate: (state) => {
      state.selectedDate = "";
    },
  },

  extraReducers: (builder) => {
    builder
      // Загрузка публикаций
      .addCase(fetchCategories.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = "failed";
        state.error =
          action.payload ?? "Не удалось загрузить публикации";
      })

      // Создание черновика
      .addCase(createDraft.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createDraft.fulfilled, (state, action) => {
        state.creating = false;
        state.draft = action.payload;
      })
      .addCase(createDraft.rejected, (state, action) => {
        state.creating = false;
        state.createError =
          action.payload ?? "Не удалось создать черновик";
      })

      // Получение черновика
      .addCase(fetchDraft.pending, (state) => {
        state.loadingDraft = true;
        state.draftError = null;
      })
      .addCase(fetchDraft.fulfilled, (state, action) => {
        state.loadingDraft = false;
        state.draft = action.payload;
      })
      .addCase(fetchDraft.rejected, (state, action) => {
        state.loadingDraft = false;
        state.draftError =
          action.payload ?? "Не удалось загрузить черновик";
      })

      // Публикация черновика
      .addCase(publishDraft.pending, (state) => {
        state.publishing = true;
        state.publishError = null;
      })
      .addCase(publishDraft.fulfilled, (state, action) => {
        state.publishing = false;
        state.draft = null;

        const index = state.categories.findIndex(
          (category) => category.id === action.payload.id
        );

        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(publishDraft.rejected, (state, action) => {
        state.publishing = false;
        state.publishError =
          action.payload ?? "Не удалось опубликовать категорию";
      })

      // Лайк: запрос отправлен
      .addCase(toggleCategoryLike.pending, (state, action) => {
        state.likeError = null;

        const id = action.meta.arg.id;

        if (!state.likingIds.includes(id)) {
          state.likingIds.push(id);
        }
      })

      // Лайк: сервер подтвердил изменение
      .addCase(toggleCategoryLike.fulfilled, (state, action) => {
        const { id, like } = action.payload;

        state.likingIds = state.likingIds.filter(
          (itemId) => itemId !== id
        );

        const category = state.categories.find(
          (item) => item.id === id
        );

        if (!category) return;

        const wasLiked = Number(category.is_liked ?? 0) === 1;
        const willBeLiked = like === 1;

        if (wasLiked !== willBeLiked) {
          const currentCount = category.likes_count ?? 0;

          category.likes_count = Math.max(
            0,
            currentCount + (willBeLiked ? 1 : -1)
          );
        }

        category.is_liked = willBeLiked ? 1 : 0;
      })

      // Лайк: сервер вернул ошибку
      .addCase(toggleCategoryLike.rejected, (state, action) => {
        state.likingIds = state.likingIds.filter(
          (id) => id !== action.meta.arg.id
        );

        state.likeError =
          action.payload ?? "Не удалось изменить лайк";
      })

      // Удаление: запрос отправлен
      .addCase(deleteCategory.pending, (state, action) => {
        state.deleteError = null;

        const id = action.meta.arg;

        if (!state.deletingIds.includes(id)) {
          state.deletingIds.push(id);
        }
      })

      // Удаление: сервер подтвердил удаление
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const id = action.payload;

        state.deletingIds = state.deletingIds.filter(
          (itemId) => itemId !== id
        );

        state.categories = state.categories.filter(
          (category) => category.id !== id
        );
      })

      // Удаление: сервер вернул ошибку
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deletingIds = state.deletingIds.filter(
          (id) => id !== action.meta.arg
        );

        state.deleteError =
          action.payload ?? "Не удалось удалить публикацию";
      });
  },
});

export const {
  clearDraft,
  clearLikeError,
  setSelectedDate,
  clearSelectedDate,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;

// Селекторы

export const selectCategories = (state: RootState) =>
  state.categories.categories;

export const selectDraft = (state: RootState) =>
  state.categories.draft;

export const selectSelectedDate = (state: RootState) =>
  state.categories.selectedDate;
