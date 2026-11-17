import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      window.localStorage.getItem("token") ||
      window.localStorage.getItem("token_ufci");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
  }
  return config;
});

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (
      erro.response &&
      erro.response.status === 401 &&
      typeof window !== "undefined"
    ) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("token_ufci");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(erro);
  },
);

export default api;
