// "use client";

// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL,
//   withCredentials: true, // Include cookies with requests
// });

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (
//       typeof window !== "undefined" &&
//       error?.response?.status === 401 &&
//       !window.location.pathname.startsWith("/auth/login")
//     ) {
//       window.location.href = "/auth/login"; // Handle unauthorized access (e.g., redirect to login)
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


// src/lib/axios.ts or src/config/axios.ts
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Add auth token interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;