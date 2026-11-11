
import { Api } from "./generated/api";

export const api = new Api({
  baseURL: window.location.origin,
});
