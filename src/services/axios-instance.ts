import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Attach the current access token to every request
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Queue of callers waiting for a token refresh to complete
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const drainQueue = (err: unknown, token: string | null) => {
  failedQueue.forEach((p) => (err ? p.reject(err) : p.resolve(token!)));
  failedQueue = [];
};

// On 401: attempt a silent token refresh, then retry the original request.
// If the refresh token is missing or expired, clear session and redirect to login.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Another refresh is already in flight — queue this request
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(original);
        })
        .catch((err) => Promise.reject(err));
    }

    original._retry = true;
    isRefreshing = true;

    const clearSession = () => {
      ["token", "refreshToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", "user", "isLoggedIn"].forEach(
        (k) => localStorage.removeItem(k),
      );
      window.location.href = "/auth/login";
    };

    if (typeof window === "undefined") {
      isRefreshing = false;
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");
    const refreshExpiry = localStorage.getItem("refreshTokenExpiresAt");

    const refreshExpired =
      !refreshToken || (refreshExpiry && new Date(refreshExpiry).getTime() <= Date.now());

    if (refreshExpired) {
      drainQueue(error, null);
      isRefreshing = false;
      clearSession();
      return Promise.reject(error);
    }

    try {
      // Use a plain axios instance (not apiClient) to avoid triggering this interceptor again
      const res = await axios.post<{
        token: string;
        accessTokenExpiresAt: string;
        refreshToken: string;
        refreshTokenExpiresAt: string;
      }>(`${baseUrl}/api/auth/refresh-token`, { refreshToken });

      const { token: newToken, refreshToken: newRefreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = res.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("accessTokenExpiresAt", accessTokenExpiresAt);
      localStorage.setItem("refreshTokenExpiresAt", refreshTokenExpiresAt);

      apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      original.headers.Authorization = `Bearer ${newToken}`;

      drainQueue(null, newToken);
      return apiClient(original);
    } catch (refreshError) {
      drainQueue(refreshError, null);
      clearSession();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
