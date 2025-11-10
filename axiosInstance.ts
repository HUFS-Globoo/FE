import axios from "axios";
import type { AxiosInstance } from "axios"; 

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const data = response.data;

    if (data && typeof data === "object" && data.profileImageUrl) {
      if (data.profileImageUrl.startsWith("/uploads") || data.profileImageUrl.startsWith("uploads")) {
        const normalizedBase = BASE_URL.endsWith("/")
          ? BASE_URL.slice(0, -1) 
          : BASE_URL;
        const normalizedPath = data.profileImageUrl.startsWith("/")
          ? data.profileImageUrl
          : "/" + data.profileImageUrl;

        data.profileImageUrl = `${normalizedBase}${normalizedPath}`;
      }
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
