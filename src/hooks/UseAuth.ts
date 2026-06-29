"use client";

import { useUser } from "@/services/UserContext";

export const useAuth = () => {
  const { user, isLoggedIn, token, isInitialized } = useUser();

  return { user, isLoggedIn, token, ready: isInitialized };
};
