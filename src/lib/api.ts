import axios from "axios";
import { notification } from "antd";

const nestAppBaseURL: string = "http://localhost:3001/api";
const carlyCIAppBaseURL: string = "http://localhost:8000/auth/login";

const api = axios.create({
  baseURL: nestAppBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (already implemented)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      if ("Authorization" in config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        Object.assign(config.headers, { Authorization: `Bearer ${token}` });
      }
    }
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response, // pass through successful responses
  (error) => {
    if (typeof window !== "undefined") {
      const message =
        error.response?.data?.message || "Une erreur est survenue";

      // Show Ant Design notification
      notification.error({
        title: 'Erreur',
        description: message,
        duration: 1,
      });

      // If 401, token invalid or expired → redirect
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.href = carlyCIAppBaseURL;
        }, 1000);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
