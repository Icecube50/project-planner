import axios from "axios";
import { AuthStore } from '@/store/auth_store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  //withCredentials: true // important if using cookies
});

// Request interceptor: add token if available
api.interceptors.request.use(
  (config) => {
    const authStore = AuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
