import axios from "axios";
import { AuthStore } from '@/store/auth_store'
import router from "@/router";
import { ref } from "vue";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true // important if using cookies
});

// Request interceptor: add token if available
api.interceptors.request.use(
  (config) => {
    if(config.skipAuth)
      return config

    const authStore = AuthStore();

    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response, async (error) => {
    const authStore = AuthStore();
    
    if (error.response?.status === 401 || error.response.status === 403) {
      try {
        await authStore.refreshToken();
        error.config.headers.Authorization = `Bearer ${authStore.token}`;
        error.config.skipAuth = false;
        return api.request(error.config); // retry original request
      } 
      catch (refreshError) {
        console.log(`${refreshError}`)
        authStore.logout();
        router.push('/Login')
      }
    }
    return Promise.reject(error);
  }
);

export default api;
