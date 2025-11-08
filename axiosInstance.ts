import axios from "axios";
import type { AxiosInstance } from "axios"; 

const BASE_URL = (import.meta as any).env.VITE_API_BASE_URL; // 👈 핵심

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});

export default axiosInstance;
