"use client";

import { useUser } from "@/services/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { useState } from "react";
import { toast } from "react-toastify";

const IndividualPaymentPage = () => {
  const { user, logout } = useUser();
  const router = useRouter();

  const [couponCode, setCouponCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const VAT_RATE = 0.075; // 7.5%
  const baseAmount = 5000;
  const VALID_COUPON = "abjedtech2025";
  const COUPON_DISCOUNT = 0.6; // 60% discount

  // Calculate discount and amounts
  const discount = couponApplied ? baseAmount * COUPON_DISCOUNT : 0;
  const amount = baseAmount - discount;
  const vatAmount = amount * VAT_RATE;
  const totalAmount = amount + vatAmount;

  const payWithPaystack = () => {
    if (!user?.email) {
      toast.error("Please login to continue");
      return;
    }

    if (isProcessing) {
      return;
    }

    // Check if PaystackPop is loaded
    // @ts-ignore - PaystackPop is loaded via script tag
    if (typeof window.PaystackPop === "undefined") {
      toast.error("Payment system not loaded. Please refresh the page.");
      return;
    }

    // @ts-ignore - PaystackPop is loaded via script tag
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
      email: user.email,
      amount: Math.round(totalAmount * 100), // convert to kobo and round
      currency: "NGN",
      metadata: {
        custom_fields: [
          {
            display_name: "User ID",
            variable_name: "user_id",
            value: user.userId,
          },
          {
            display_name: "Base Price",
            variable_name: "base_price",
            value: baseAmount,
          },
          {
            display_name: "Discount Amount",
            variable_name: "discount_amount",
            value: discount,
          },
          {
            display_name: "Final Price Per Student",
            variable_name: "price_per_student",
            value: amount,
          },
          {
            display_name: "VAT Amount",
            variable_name: "vat_amount",
            value: vatAmount,
          },
          {
            display_name: "Coupon Code",
            variable_name: "coupon_code",
            value: couponApplied ? couponCode : "none",
          },
        ],
      },
      onClose: function () {
        toast.info("Payment cancelled");
      },
      callback: function (response: any) {
        verifyPayment(response.reference);
      },
    });

    handler.openIframe();
  };

  const verifyPayment = async (reference: string) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const res = await axios.get(`${baseUrl}/payments/verify`, {
        params: {
          reference,
        },
      });

      // Check if payment verification was successful (status 200)
      if (res.status === 200) {
        toast.success("Payment successful!");
        
        // Register the payment details
        try {
          await axios.post(`${baseUrl}/payments/register-payment`, {
            reference: reference,
            userId: user?.userId,
            studentCount: 1,
            pricePerStudent: amount,
            subtotal: amount,
            vatAmount: vatAmount,
            amount: totalAmount,
          });
          
          // Reset coupon state after successful registration
          setCouponCode("");
          setCouponApplied(false);
          
          // Redirect to dashboard
          router.push("/dashboard");
        } catch (error) {
          console.error("Failed to register payment:", error);
          toast.error("Payment successful but failed to register. Please contact support.");
          // Still redirect even if registration fails since payment went through
          setTimeout(() => router.push("/dashboard"), 2000);
        }
      } else {
        // Log the response for debugging
        console.log("Verification response:", res.data);
        toast.error("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("An error occurred. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Format number to currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Apply coupon code
  const applyCoupon = () => {
    setCouponError("");

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (couponCode.toLowerCase() === VALID_COUPON.toLowerCase()) {
      setCouponApplied(true);
      toast.success("Coupon applied! 60% discount activated.");
    } else {
      setCouponError("Invalid coupon code");
      toast.error("Invalid coupon code");
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponCode("");
    setCouponError("");
    toast.info("Coupon removed");
  };

  const handleLogout = () => {
    nProgress.start();
    logout();
    nProgress.done();
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 p-2 lg:p-8 mt-3 lg:mt-5">
      <div className="flex justify-end">
        <button
          className="bg-white text-red-500 border-red-500 border hover:bg-red-500 hover:text-white px-2 md:px-3  p-1 md:p-2 text-xs rounded-lg font-medium transition-colors duration-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="flex flex-col gap-2 lg:gap-3">
        <p className="lg:text-lg font-semibold">Student payment</p>
        <p className="text-sm">Add coupon code or proceed to payment</p>
      </div>

      <div className="flex flex-col lg:flex-row justify-between lg:p-2 gap-4">
        <div className="flex flex-col gap-4 bg-white rounded-md p-4 py-4 w-full lg:w-[48%]">
          <label htmlFor="couponCode" className="text-sm font-semibold">
            Coupon Code
          </label>
          <div className="flex gap-2">
            <input
              className={`border rounded-md p-2 text-sm flex-1 ${
                couponError ? "border-red-500" : "border-gray-200"
              } ${couponApplied ? "bg-green-50 border-green-500" : ""}`}
              type="text"
              value={couponCode || ""}
              onChange={(e) => {
                setCouponCode(e.target.value);
                setCouponError("");
              }}
              id="couponCode"
              placeholder="Enter coupon code"
              disabled={isProcessing || couponApplied}
            />
            {!couponApplied ? (
              <button
                onClick={applyCoupon}
                disabled={isProcessing || !couponCode.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-900"
              >
                Apply
              </button>
            ) : (
              <button
                onClick={removeCoupon}
                disabled={isProcessing}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
              >
                Remove
              </button>
            )}
          </div>
          {couponError && <p className="text-xs text-red-600">{couponError}</p>}
          {couponApplied && (
            <p className="text-xs text-green-600 font-semibold">
              ✓ Coupon applied: 60% discount
            </p>
          )}
          <div className="text-xs space-y-1">
            <p className="font-semibold">Pricing Tiers:</p>
            <p> ₦5,000/student</p>
            <p className="text-gray-500 mt-2">*Prices exclude 7.5% VAT</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 bg-white rounded-md p-4 py-4 w-full lg:w-[48%]">
          <div className="flex justify-between">
            <p className="text-sm">Base Price:</p>
            <p className="text-sm">₦{formatCurrency(baseAmount)}</p>
          </div>

          {couponApplied && (
            <div className="flex justify-between text-green-600">
              <p className="text-sm">Discount (60%):</p>
              <p className="text-sm">-₦{formatCurrency(discount)}</p>
            </div>
          )}

          <div className="flex justify-between">
            <p className="text-sm">Subtotal:</p>
            <p className="text-sm">₦{formatCurrency(amount)}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-sm">VAT (7.5%):</p>
            <p className="text-sm">₦{formatCurrency(vatAmount)}</p>
          </div>

          <div className="flex justify-between mt-4 border-t border-t-gray-200 pt-2">
            <p className="text-sm font-semibold">Total:</p>
            <p className="text-sm font-semibold">
              ₦{formatCurrency(totalAmount)}
            </p>
          </div>

          <p className="text-xs text-gray-600 mt-2">
            ₦{formatCurrency(amount + vatAmount)} per student (incl. VAT)
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1 items-center">
        <button
          className="bg-blue-600 text-white p-2 text-xs md:text-sm rounded-md w-full disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={payWithPaystack}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Proceed to checkout"}
        </button>
        <p className="text-xs text-blue-950">
          Secure payment processing * All transactions are encrypted
        </p>
      </div>
    </div>
  );
};

export default IndividualPaymentPage;
