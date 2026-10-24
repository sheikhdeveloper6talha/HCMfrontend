import axios from "axios";

// One shared Axios instance for the whole app
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hcm_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;
    const onAuthPage = ["/login", "/setup"].includes(window.location.pathname);
    if (status === 401 && !onAuthPage) {
      localStorage.removeItem("hcm_token");
      window.location.assign("/login");
    }
    if (status === 403 && code === "PASSWORD_CHANGE_REQUIRED" && window.location.pathname !== "/change-password") {
      window.location.assign("/change-password");
    }
    return Promise.reject(error);
  }
);

export default api;
