"use client";

import axios from "@/services/axios-instance";

import { createContext, useContext, useEffect, useState } from "react";
import AuthInitializer from "./AuthInitializer";

interface User {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const logout = async () => {
    setUserState(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.setItem("isLoggedIn", "false");

    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }

    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
    } else {
      localStorage.removeItem("user");
      localStorage.setItem("isLoggedIn", "false");
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, isLoggedIn, setIsLoggedIn, logout }}
    >
      {/* 👇 this makes sure useAuth is called in a client-safe way */}
      <AuthInitializer />
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
