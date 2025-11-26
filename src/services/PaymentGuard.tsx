"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "./UserContext";


interface PaymentGuardProps {
  children: React.ReactNode;
  paymentRoute: string; // e.g., "/dashboard/payments" or "/school/dashboard/payments"
}

const PaymentGuard = ({ children, paymentRoute }: PaymentGuardProps) => {
  const { user, isLoggedIn, isInitialized } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to check if user has active subscription
  const hasActiveSubscription = (user: any) => {
    return user?.subscription !== null && user?.subscription !== undefined;
  };

  useEffect(() => {
    // Don't do anything until UserContext is initialized
    if (!isInitialized) {
      console.log("PaymentGuard - Waiting for initialization");
      return;
    }

    console.log("PaymentGuard - Current pathname:", pathname);
    console.log("PaymentGuard - User subscription:", user?.subscription);

    // If user is on the payment route itself, don't redirect
    if (pathname === paymentRoute) {
      console.log("PaymentGuard - Already on payment route");
      setIsLoading(false);
      return;
    }

    // Check if user is logged in, verified, but hasn't paid
    if (
      isLoggedIn &&
      user &&
      user.isVerified &&
      !hasActiveSubscription(user)
    ) {
      console.log(`PaymentGuard - No subscription, redirecting to ${paymentRoute}`);
      router.replace(paymentRoute);
      return;
    }

    // If user has active subscription and is on payment page, redirect to dashboard
    if (
      isLoggedIn &&
      user &&
      user.isVerified &&
      hasActiveSubscription(user) &&
      pathname === paymentRoute
    ) {
      const dashboardRoute = paymentRoute.replace("/payments", "");
      console.log(`PaymentGuard - Has subscription, redirecting to ${dashboardRoute}`);
      router.replace(dashboardRoute);
      return;
    }

    console.log("PaymentGuard - Setting loading to false");
    setIsLoading(false);
  }, [isLoggedIn, user, isInitialized, pathname, router, paymentRoute]);

  // Show loading spinner while checking payment status
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PaymentGuard;