
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  logout: () => Promise<void>;
  token: string | null;
  setToken: (token: string | null) => void;
  isInitialized: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [token, setTokenState] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const router = useRouter();

  const logout = async () => {
    try {
      console.log("UserContext - Logging out user");
      // await apiLogout();
      clearUserData();
      
      // Redirect to login and replace history to prevent back button issues
      router.replace("/auth/login");
      
      // Clear browser history for the current session (optional but recommended)
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", "/auth/login");
      }
    } catch (err) {
      console.error("Logout error:", err);
      // Always clear local state regardless of API call success
      clearUserData();
      router.replace("/auth/login");
    }
  };

  const clearUserData = () => {
    console.log("UserContext - Clearing user data");
    setUserState(null);
    setIsLoggedIn(false);
    setTokenState(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
  };

  // Check for token expiration
  const checkTokenValidity = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        // If you're using JWTs, you can decode and check expiration
        // const decoded = jwt.decode(storedToken);
        // if (decoded.exp * 1000 < Date.now()) {
        //   clearUserData();
        //   return false;
        // }
        return true;
      } catch (error) {
        console.error("Token validation error:", error);
        clearUserData();
        return false;
      }
    }
    return false;
  };

  // Initialize from localStorage on mount
  useEffect(() => {
    console.log("UserContext - Initializing from localStorage");
    
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    console.log("UserContext - Stored data:", {
      hasUser: !!storedUser,
      hasToken: !!storedToken,
      isLoggedIn: storedIsLoggedIn
    });

    if (storedUser && storedToken && checkTokenValidity()) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserState(parsedUser);
        setTokenState(storedToken);
        setIsLoggedIn(storedIsLoggedIn === "true");
        console.log("UserContext - User restored from localStorage:", parsedUser.email);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        clearUserData();
      }
    } else {
      console.log("UserContext - No valid stored data, clearing user data");
      clearUserData();
    }
    
    setIsInitialized(true);
  }, []);

  // Listen for storage changes (handles logout in other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      console.log("UserContext - Storage change detected:", e.key, e.newValue);
      
      if (e.key === "token" && !e.newValue) {
        // Token was removed, user logged out in another tab
        console.log("UserContext - Token removed in another tab, logging out");
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

  const setUser = (user: User | null) => {
    console.log("UserContext - Setting user:", user?.email || "null");
    setUserState(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  const setToken = (token: string | null) => {
    console.log("UserContext - Setting token:", !!token);
    setTokenState(token);
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
    }
  };

  // Don't render children until context is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, isLoggedIn, setIsLoggedIn, logout, token, setToken, isInitialized, }}
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