"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export interface Subscription {
  active: boolean;
  startsAt: string;
  endsAt: string;
  studentsCovered: number;
  pricePerStudent: number;
  lastPaymentReference: string;
  daysRemaining: number;
  isExpired: boolean;
}

export interface CurrentTier {
  id: string;
  tierName: string;
  minStudents: number;
  maxStudents: number;
  pricePerStudent: number;
  isMatch: boolean;
}

export interface User {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  country: string;
  dob: string;
  role?: string;
  avatarUrl?: string;
  isVerified: boolean;
  schoolId?: string;
  schoolName?: string;
  schoolCurrency?: string;
  subscription?: Subscription | null;
  currentTier?: CurrentTier | null;
  promoApplied?: boolean | null;
}

export interface SessionPayload {
  user: User;
  token: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  token: string | null;
  setToken: (token: string | null) => void;
  setSession: (payload: SessionPayload) => void;
  isInitialized: boolean;
  isRefreshing: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const SK = {
  user: "user",
  token: "token",
  refreshToken: "refreshToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  isLoggedIn: "isLoggedIn",
} as const;

const isExpired = (expiresAt: string | null): boolean => {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() <= Date.now();
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [token, setTokenState] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const clearUserData = () => {
    setUserState(null);
    setIsLoggedIn(false);
    setTokenState(null);
    Object.values(SK).forEach((key) => localStorage.removeItem(key));
  };

  const setSession = (payload: SessionPayload) => {
    const { user, token, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = payload;
    setUserState(user);
    setTokenState(token);
    setIsLoggedIn(true);
    localStorage.setItem(SK.user, JSON.stringify(user));
    localStorage.setItem(SK.token, token);
    localStorage.setItem(SK.refreshToken, refreshToken);
    localStorage.setItem(SK.accessTokenExpiresAt, accessTokenExpiresAt);
    localStorage.setItem(SK.refreshTokenExpiresAt, refreshTokenExpiresAt);
    localStorage.setItem(SK.isLoggedIn, "true");
  };

  const logout = async () => {
    try {
      clearUserData();
      router.replace("/auth/login");
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", "/auth/login");
      }
    } catch (err) {
      console.error("Logout error:", err);
      clearUserData();
      router.replace("/auth/login");
    }
  };

  // Silently refresh the access token using the stored refresh token.
  // Returns true on success, false if refresh is not possible or fails.
  const attemptTokenRefresh = async (): Promise<boolean> => {
    const storedRefreshToken = localStorage.getItem(SK.refreshToken);
    const refreshExpiry = localStorage.getItem(SK.refreshTokenExpiresAt);

    if (!storedRefreshToken || isExpired(refreshExpiry)) return false;

    try {
      const res = await axios.post<{
        token: string;
        accessTokenExpiresAt: string;
        refreshToken: string;
        refreshTokenExpiresAt: string;
      }>(`${baseUrl}/api/auth/refresh-token`, { refreshToken: storedRefreshToken });

      const { token: newToken, refreshToken: newRefreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = res.data;
      localStorage.setItem(SK.token, newToken);
      localStorage.setItem(SK.refreshToken, newRefreshToken);
      localStorage.setItem(SK.accessTokenExpiresAt, accessTokenExpiresAt);
      localStorage.setItem(SK.refreshTokenExpiresAt, refreshTokenExpiresAt);
      setTokenState(newToken);
      return true;
    } catch {
      return false;
    }
  };

  const refreshUser = async () => {
    const currentToken = token || localStorage.getItem(SK.token);
    if (!currentToken) return;

    setIsRefreshing(true);
    try {
      const res = await axios.get(`${baseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${currentToken}`, "Content-Type": "application/json" },
      });

      const data = res.data;
      const updatedUser: User = {
        userId: data.userId || data.id,
        fullName: data.fullName || data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        country: data.country,
        dob: data.dob,
        role: data.role,
        avatarUrl: data.avatarUrl,
        isVerified: data.isVerified,
        schoolId: data.schoolId,
        schoolName: data.schoolName,
        schoolCurrency: data.schoolCurrency,
        subscription: data.subscription,
        currentTier: data.currentTier,
        promoApplied: data.promoApplied,
      };

      setUserState(updatedUser);
      localStorage.setItem(SK.user, JSON.stringify(updatedUser));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await logout();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // On mount: restore session or attempt silent token refresh if access token expired
  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem(SK.user);
      const storedToken = localStorage.getItem(SK.token);
      const accessTokenExpiresAt = localStorage.getItem(SK.accessTokenExpiresAt);
      const storedIsLoggedIn = localStorage.getItem(SK.isLoggedIn);

      if (!storedUser || !storedToken) {
        clearUserData();
        setIsInitialized(true);
        return;
      }

      if (!isExpired(accessTokenExpiresAt)) {
        // Access token is still valid — restore session directly
        try {
          setUserState(JSON.parse(storedUser));
          setTokenState(storedToken);
          setIsLoggedIn(storedIsLoggedIn === "true");
        } catch {
          clearUserData();
        }
      } else {
        // Access token expired — attempt silent refresh
        const refreshed = await attemptTokenRefresh();
        if (refreshed) {
          try {
            setUserState(JSON.parse(storedUser));
            setIsLoggedIn(true);
          } catch {
            clearUserData();
          }
        } else {
          clearUserData();
        }
      }

      setIsInitialized(true);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cross-tab logout sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SK.token && !e.newValue) {
        setUserState(null);
        setIsLoggedIn(false);
        setTokenState(null);
        router.replace("/auth/login");
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [router]);

  // Keep setUser/setToken for backward compatibility with existing call sites
  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem(SK.user, JSON.stringify(user));
    } else {
      localStorage.removeItem(SK.user);
    }
  };

  const setToken = (token: string | null) => {
    setTokenState(token);
    if (token) {
      localStorage.setItem(SK.token, token);
      localStorage.setItem(SK.isLoggedIn, "true");
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem(SK.token);
      localStorage.removeItem(SK.isLoggedIn);
      setIsLoggedIn(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        logout,
        refreshUser,
        token,
        setToken,
        setSession,
        isInitialized,
        isRefreshing,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
