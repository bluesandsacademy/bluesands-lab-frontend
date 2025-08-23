"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "./UserContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, isLoggedIn, token, isInitialized } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // Define public routes that don't require authentication
  const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password", "/"];

  // Helper function to get role-based dashboard route
  const getDashboardRoute = (userRole?: string) => {
    if (userRole === "schoolAdmin" || userRole === "SchoolAdmin") {
      return "/school/dashboard";
    }
    return "/dashboard"; // default for students and other roles
  };

  useEffect(() => {
    // Don't do anything until UserContext is initialized
    if (!isInitialized) {
      console.log("AuthGuard - Waiting for UserContext initialization");
      return;
    }

    console.log("AuthGuard - Current pathname:", pathname);
    console.log("AuthGuard - isLoggedIn:", isLoggedIn);
    console.log("AuthGuard - token exists:", !!token);
    console.log("AuthGuard - user role:", user?.role);

    // Check if current route is public
    const isPublicRoute = publicRoutes.some(route => {
      if (route === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(route);
    });

    console.log("AuthGuard - Is public route:", isPublicRoute);

    // If user is not logged in and trying to access protected route
    if (!isLoggedIn && !token && !isPublicRoute) {
      console.log("AuthGuard - Redirecting to login (not authenticated)");
      router.replace("/auth/login");
      return;
    }

    // If user is logged in and trying to access auth pages, redirect to appropriate dashboard
    if (isLoggedIn && token && pathname.startsWith("/auth/")) {
      const dashboardRoute = getDashboardRoute(user?.role);
      console.log(`AuthGuard - Redirecting to ${dashboardRoute} (already authenticated)`);
      router.replace(dashboardRoute);
      return;
    }

    if (isLoggedIn && token && user) {
  // Check if student is trying to access school admin routes
  if (user.role === "student" && pathname.startsWith("/school/")) {
    console.log("AuthGuard - Student trying to access school routes, redirecting to dashboard");
    router.replace("/dashboard");
    return;
  }
  
  // Check if school admin is trying to access student-only routes (if any)
  if ((user.role === "schoolAdmin" || user.role === "SchoolAdmin") && pathname === "/dashboard") {
    console.log("AuthGuard - School admin trying to access student dashboard, redirecting to school dashboard");
    router.replace("/school/dashboard");
    return;
  }
}

    console.log("AuthGuard - Setting loading to false");
    setIsLoading(false);
  }, [isLoggedIn, token, pathname, router, isInitialized, user?.role]);

  // Add additional effect to handle browser back button after logout
  useEffect(() => {
    const handlePopState = () => {
      console.log("PopState event - checking auth status");
      const currentToken = localStorage.getItem("token");
      const currentIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      
      if (!currentToken || !currentIsLoggedIn) {
        const isPublicRoute = publicRoutes.some(route => {
          if (route === "/") {
            return window.location.pathname === "/";
          }
          return window.location.pathname.startsWith(route);
        });
        
        if (!isPublicRoute) {
          console.log("PopState - Redirecting to login");
          router.replace("/auth/login");
        }
      }
    };

    // Listen for browser navigation events
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  // Show loading spinner while checking authentication
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;