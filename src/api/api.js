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
    const originalRequest = error.config
    console.log('response interceptor')

    // Refresh failed -> logout user
    if (originalRequest.url.includes('/api/refresh')) {
      authStore.logout();
      router.push('/Login');
      return Promise.reject(error);
    }
    
    // Any other request failed -> Try to refresh token and then retry original request
    if (error.response?.status === 401 || error.response.status === 403) {
      try {
        await authStore.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${authStore.token}`;
        originalRequest.skipAuth = true;
        return api.request(originalRequest); // retry original request
      } 
      catch (refreshError) {
        authStore.logout();
        router.push('/Login')
      }
    }

    // Original request failed but due to non credential related error -> probably need different error handling here, for now treat as bad credentials
    authStore.logout();
    router.push('/Login')
    return Promise.reject(error);
  }
);

export default api;
