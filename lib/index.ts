export const __is_prod__ = process.env.NODE_ENV === "production";
export const BASE_URL = __is_prod__
  ? "https://flask.up.railway.app"
  : `http://127.0.0.1:5000`;
