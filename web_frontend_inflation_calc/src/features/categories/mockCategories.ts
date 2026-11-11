import type { Category } from "./categoriesSlice";

export const mockCategories: Category[] = [
  {
    id: -1,
    title: "Продукты питания",
    description:
      "За неделю цены на некоторые продукты питания изменились. Особенно заметен рост стоимости овощей и молочной продукции.",
    status: "published",
    historical_date: "2026-11-11",
    basket_weight: 35,
    likes_count: 12,
    is_liked: 0,
    is_creator: 0,
    image_url: "",
    video_url: "",
  },
  {
    id: -2,
    title: "Транспорт",
    description:
      "Изменение стоимости проезда в общественном транспорте повлияло на расходы потребителей.",
    status: "published",
    historical_date: "2026-11-10",
    basket_weight: 20,
    likes_count: 8,
    is_liked: 0,
    is_creator: 0,
    image_url: "",
    video_url: "",
  },
  {
    id: -3,
    title: "Одежда и обувь",
    description:
      "В категории одежды и обуви наблюдаются изменения цен на сезонные товары.",
    status: "published",
    historical_date: "2026-11-09",
    basket_weight: 15,
    likes_count: 5,
    is_liked: 0,
    is_creator: 0,
    image_url: "",
    video_url: "",
  },
  {
    id: -4,
    title: "Жилищно-коммунальные услуги",
    description:
      "Изменение тарифов на коммунальные услуги отражается на ежемесячных расходах домохозяйств.",
    status: "published",
    historical_date: "2026-11-11",
    basket_weight: 30,
    likes_count: 16,
    is_liked: 0,
    is_creator: 0,
    image_url: "",
    video_url: "",
  },
];
