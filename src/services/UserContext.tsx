"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { logout as apiLogout } from "@/services/auth-service";

// Use the same User interface from auth-service
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
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  logout: () => Promise<void>;
  token: string | null;
  setToken: (token: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [token, setTokenState] = useState<string | null>(null);

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always clear local state regardless of API call success
      setUserState(null);
      setIsLoggedIn(false);
      setTokenState(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
    }
  };

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser && storedToken) {
      try {
        setUserState(JSON.parse(storedUser));
        setTokenState(storedToken);
        setIsLoggedIn(storedIsLoggedIn === "true");
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear corrupted data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
      }
    }
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  const setToken = (token: string | null) => {
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

  return (
    <UserContext.Provider
      value={{ user, setUser, isLoggedIn, setIsLoggedIn, logout, token, setToken }}
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