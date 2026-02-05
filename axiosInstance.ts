import axios from "axios";
import type { AxiosInstance } from "axios"; 

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  // 기본 타임아웃을 5초 → 20초로 확장 (모든 API 공통 적용)
  timeout: 20000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
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
    // 403 에러 (토큰 만료 등) 처리
    if (error.response?.status === 403) {
      // 토큰 만료 알림
      alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
      
      // localStorage 클리어
      localStorage.clear();
      
      // 로그인 페이지로 이동
      globalThis.location.href = "/login";
      
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
