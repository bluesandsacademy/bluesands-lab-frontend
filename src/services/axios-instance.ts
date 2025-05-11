"use client";

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true, // Include cookies with requests
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error?.response?.status === 401 &&
      !window.location.pathname.startsWith("/auth/login")
    ) {
      window.location.href = "/auth/login"; // Handle unauthorized access (e.g., redirect to login)
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
