"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@/services/UserContext";

export const useAuth = () => {
  const { user, isLoggedIn, token } = useUser();
  const [ready, setReady] = useState(false);
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    // Temporary: Since /auth/me endpoint doesn't exist yet,
    // we'll just validate based on localStorage data
    const validateAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

        // If we have all required data and user context is synced
        if (storedUser && storedToken && storedIsLoggedIn === "true" && user && isLoggedIn) {
          // User is authenticated
          setReady(true);
        } else if (!storedUser || !storedToken || storedIsLoggedIn !== "true") {
          // No valid auth data found
          setReady(true);
        } else {
          // Data exists but context hasn't loaded yet, wait a bit
          setTimeout(() => setReady(true), 100);
        }
      } catch (err) {
        console.error("Auth validation error:", err);
        setReady(true);
      }
    };

    validateAuth();
  }, [user, isLoggedIn, token]);

  return { user, isLoggedIn, ready, token };
};

// Alternative approach: Hook for when /auth/me is available
export const useAuthWithAPI = () => {
  const { user, setUser, setIsLoggedIn, setToken } = useUser();
  const [ready, setReady] = useState(false);
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const fetchUser = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        
        if (!storedToken) {
          setReady(true);
          return;
        }

        // When /auth/me endpoint is ready, uncomment this:
        /*
        const res = await axios.get("/auth/me", { 
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        
        const fetchedUser = res.data;
        setUser(fetchedUser);
        setIsLoggedIn(true);
        */

        // For now, just use stored data
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
          setToken(storedToken);
        }

      } catch (err) {
        console.error("Session restore failed:", err);
        // Clear invalid session data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        setUser(null);
        setIsLoggedIn(false);
        setToken(null);
      } finally {
        setReady(true);
      }
    };

    fetchUser();
  }, [setUser, setIsLoggedIn, setToken]);

  return { user, isLoggedIn: !!user, ready };
};


// "use client";

// import { useEffect, useRef, useState } from "react";
// import axios from "@/services/axios-instance";
// import { useUser } from "@/services/UserContext";

// export const useAuth = () => {
//   const { user, setUser, setIsLoggedIn, isLoggedIn } = useUser();
//   const [ready, setReady] = useState(false); // 👈 track auth state

//   const didRun = useRef(false); // 👈 prevent double-fetch in dev strict mode

//   useEffect(() => {
//     if (didRun.current) return;
//     didRun.current = true;

//     const fetchUser = async () => {
//       try {
//         // if (isLoggedIn) {
//         const res = await axios.get("/auth/me", { withCredentials: true });
//         const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//         const fetchedUser = res.data;
//         // Merge the stored user with the fetched user
//         // This is useful if you want to keep some local state in sync with the server
//         const fullUser = { ...storedUser, ...fetchedUser };
//         setUser(fullUser);
//         setIsLoggedIn(true);
//         //}
//       } catch (err) {
//         console.error("Session restore failed:", err);
//         setUser(null);
//         setIsLoggedIn(false);
//       } finally {
//         setReady(true); // 👈 ensure ready is true whether success or failure
//       }
//     };

//     fetchUser();
//   }, [setUser, setIsLoggedIn]);
//   return { user, isLoggedIn, ready };
// };
