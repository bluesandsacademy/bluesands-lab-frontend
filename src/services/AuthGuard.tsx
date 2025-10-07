"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "./UserContext";
import { resendVerification } from "./auth-service";
import { toast } from "react-toastify";
import NProgress from "nprogress";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, isLoggedIn, token, isInitialized, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // public routes that don't require authentication
  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/verify-email",
    "/",
    "/auth/verify-success",
  ];

  // routes that don't require email verification
  const noVerificationRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/verify-email",
    "/",
    "/auth/verify-success",
    "/admin/dashboard"
  ];

  // routes that don't require payment (can be accessed even without subscription)
  const noPaymentRequiredRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/verify-email",
    "/",
    "/auth/verify-success",
    "/make-payment",
    "/bulk-payment",
    "/school/dashboard",
    "/dashboard"
  ];

  // Helper function to check if user has paid
  const hasActiveSubscription = (user: any) => {
    return user?.subscription !== null && user?.subscription !== undefined;
  };

  // Helper function to get payment route based on role
  const getPaymentRoute = (userRole?: string) => {
    if (userRole === "schoolAdmin" || userRole === "SchoolAdmin") {
      return "/bulk-payment";
    }
    return "/make-payment"; // default for students
  };

  // Helper function to get role-based dashboard route
  const getDashboardRoute = (userRole?: string) => {
    if (userRole === "schoolAdmin" || userRole === "SchoolAdmin") {
      return "/school/dashboard";
    } else if (userRole === "globalAdmin"|| userRole === "GlobalAdmin"){
      return "/admin/dashboard"
    }
    return "/dashboard"; // default for students and other roles
  };

  // Helper function to request new verification email
  const handleRequestVerification = async () => {
    NProgress.start();
    try {
      // Check if user and email exist
      if (!user?.email) {
        toast.error("Email not found. Please try logging in again.");
        return;
      }
      console.log("Requesting new verification email for:", user?.email);
      // API call:
      await resendVerification(user?.email);
      toast.success("Verification email sent! Please check your email inbox.");
      NProgress.done();
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error("Failed to send verification email. Please try again.");
      NProgress.done();
    }
  };

  const handleLogout = () => {
    NProgress.start();
    logout();
    router.push("/login");
    NProgress.done();
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
    console.log("AuthGuard - user verified:", user?.isVerified);
    console.log("AuthGuard - user subscription:", user?.subscription);

    // Check if current route is public
    const isPublicRoute = publicRoutes.some((route) => {
      if (route === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(route);
    });

    // Check if current route requires verification
    const requiresVerification = !noVerificationRoutes.some((route) => {
      if (route === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(route);
    });

    // Check if current route requires payment
    const requiresPayment = !noPaymentRequiredRoutes.some((route) => {
      if (route === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(route);
    });

    console.log("AuthGuard - Is public route:", isPublicRoute);
    console.log("AuthGuard - Requires verification:", requiresVerification);
    console.log("AuthGuard - Requires payment:", requiresPayment);

    // If user is not logged in and trying to access protected route
    if (!isLoggedIn && !token && !isPublicRoute) {
      console.log("AuthGuard - Redirecting to login (not authenticated)");
      router.replace("/auth/login");
      return;
    }

    // If user is logged in but not verified and trying to access protected route
    if (
      isLoggedIn &&
      token &&
      user &&
      !user.isVerified &&
      requiresVerification
    ) {
      console.log(
        "AuthGuard - User not verified, staying on verification screen"
      );
      setIsLoading(false);
      return;
    }

    // If user is verified but hasn't paid and trying to access protected route
    if (
      isLoggedIn &&
      token &&
      user &&
      user.isVerified &&
      !hasActiveSubscription(user) &&
      requiresPayment
    ) {
      const paymentRoute = getPaymentRoute(user.role);
      console.log(
        `AuthGuard - User verified but no subscription, redirecting to ${paymentRoute}`
      );
      router.replace(paymentRoute);
      return;
    }

    // If user is logged in and trying to access auth pages, redirect to appropriate dashboard
    if (
      isLoggedIn &&
      token &&
      pathname.startsWith("/auth/") &&
      !pathname.startsWith("/auth/verify-email")
    ) {
      // Check if user needs to pay first
      if (user && user.isVerified && !hasActiveSubscription(user)) {
        const paymentRoute = getPaymentRoute(user.role);
        console.log(
          `AuthGuard - Redirecting to ${paymentRoute} (payment required)`
        );
        router.replace(paymentRoute);
        return;
      }

      const dashboardRoute = getDashboardRoute(user?.role);
      console.log(
        `AuthGuard - Redirecting to ${dashboardRoute} (already authenticated)`
      );
      router.replace(dashboardRoute);
      return;
    }

    if (isLoggedIn && token && user && user.isVerified && hasActiveSubscription(user)) {
      // Check if student is trying to access school admin routes
      if (user.role === "student" && pathname.startsWith("/school/")) {
        console.log(
          "AuthGuard - Student trying to access school routes, redirecting to dashboard"
        );
        router.replace("/dashboard");
        return;
      }

      // Check if school admin is trying to access student-only routes
      if (
        (user.role === "schoolAdmin" || user.role === "SchoolAdmin") &&
        pathname === "/dashboard"
      ) {
        console.log(
          "AuthGuard - School admin trying to access student dashboard, redirecting to school dashboard"
        );
        router.replace("/school/dashboard");
        return;
      }

      // If user is on payment page but already has subscription, redirect to dashboard
      if (pathname === "/make-payment" || pathname === "/bulk-payment") {
        const dashboardRoute = getDashboardRoute(user.role);
        console.log(
          `AuthGuard - User already has subscription, redirecting to ${dashboardRoute}`
        );
        router.replace(dashboardRoute);
        return;
      }
    }

    console.log("AuthGuard - Setting loading to false");
    setIsLoading(false);
  }, [
    isLoggedIn,
    token,
    pathname,
    router,
    isInitialized,
    user?.role,
    user?.isVerified,
    user?.subscription,
  ]);

  // Add additional effect to handle browser back button after logout
  useEffect(() => {
    const handlePopState = () => {
      console.log("PopState event - checking auth status");
      const currentToken = localStorage.getItem("token");
      const currentIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (!currentToken || !currentIsLoggedIn) {
        const isPublicRoute = publicRoutes.some((route) => {
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

  // Show verification screen if user is logged in but not verified
  if (
    isLoggedIn &&
    user &&
    !user.isVerified &&
    !noVerificationRoutes.some((route) => {
      if (route === "/") return pathname === "/";
      return pathname.startsWith(route);
    })
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white flex flex-col p-8 items-center rounded-lg shadow-lg text-center max-w-md">
          <div className="mb-6">
            <img
              src="/images/logo/blue_sands_blue.png"
              alt="Logo"
              className="w-auto h-[80px] mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Email Verification Required
            </h2>
            <p className="text-gray-600 mb-6">
              Your email has not been verified. Please click on the verification
              link sent to your email, or request a new verification email
              below.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Email: <span className="font-medium">{user.email}</span>
            </p>
          </div>
          <button
            onClick={handleRequestVerification}
            className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Request New Verification Email
          </button>
          <button
            className="text-blue-600 bg-slate-300 rounded-md px-2 mt-6 border border-blue-500"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;