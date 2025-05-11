"use client";

import { useEffect, useRef, useState } from "react";
import axios from "@/services/axios-instance";
import { useUser } from "@/services/UserContext";

export const useAuth = () => {
  const { user, setUser, setIsLoggedIn, isLoggedIn } = useUser();
  const [ready, setReady] = useState(false); // 👈 track auth state

  const didRun = useRef(false); // 👈 prevent double-fetch in dev strict mode

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const fetchUser = async () => {
      try {
        // if (isLoggedIn) {
        const res = await axios.get("/auth/me", { withCredentials: true });
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const fetchedUser = res.data;
        // Merge the stored user with the fetched user
        // This is useful if you want to keep some local state in sync with the server
        const fullUser = { ...storedUser, ...fetchedUser };
        setUser(fullUser);
        setIsLoggedIn(true);
        //}
      } catch (err) {
        console.error("Session restore failed:", err);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setReady(true); // 👈 ensure ready is true whether success or failure
      }
    };

    fetchUser();
  }, [setUser, setIsLoggedIn]);
  return { user, isLoggedIn, ready };
};
