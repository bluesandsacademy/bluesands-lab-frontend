"use client";

import { useUser } from "@/services/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { useState } from "react";
import { toast } from "react-toastify";

const SchoolStudentPaymentPage = () => {
  const { user, logout } = useUser();
  const router = useRouter();
  const [studentCount, setStudentCount] = useState(0);
  const VAT_RATE = 0.075; // 7.5%

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [couponCode, setCouponCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const VALID_COUPON = "abjedtech2025";
  const COUPON_DISCOUNT = 0.6; // 60% discount

  // Function to get price per student based on quantity
  const getPricePerStudent = (count: number): number => {
    if (count >= 501 && count <= 1000) return 3500;
    if (count >= 301 && count <= 500) return 4000;
    if (count >= 101 && count <= 300) return 4500;
    if (count >= 50 && count <= 100) return 5000;
    return 5000; // Default price for less than 50
  };

  // Calculate pricing breakdown
  const pricePerStudent = getPricePerStudent(studentCount);
  const subtotal = studentCount * pricePerStudent;
  const discountAmount = couponApplied ? subtotal * COUPON_DISCOUNT : 0;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const vatAmount = subtotalAfterDiscount * VAT_RATE;
  const totalAmount = subtotalAfterDiscount + vatAmount;
  const pricePerStudentWithVAT = pricePerStudent + pricePerStudent * VAT_RATE;

  // Handle coupon application
  const applyCoupon = () => {
    setCouponError("");

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (couponCode.trim().toLowerCase() === VALID_COUPON.toLowerCase()) {
      setCouponApplied(true);
      toast.success("Coupon applied! 60% discount added");
    } else {
      setCouponError("Invalid coupon code");
      toast.error("Invalid coupon code");
    }
  };

  // Handle coupon removal
  const removeCoupon = () => {
    setCouponCode("");
    setCouponApplied(false);
    setCouponError("");
    toast.info("Coupon removed");
  };

  const payWithPaystack = () => {
    // Validation
    if (!studentCount || studentCount <= 0) {
      toast.error("Please enter a valid number of students");
      return;
    }

    if (studentCount > 1000) {
      toast.error(
        "Maximum 1000 students allowed. Please contact support for larger orders."
      );
      return;
    }

    if (!user?.email) {
      toast.error("Please login to continue");
      return;
    }

    setIsProcessing(true);

    // @ts-ignore - PaystackPop is loaded via script tag
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
      email: user.email,
      amount: Math.round(totalAmount * 100), // convert to kobo and round
      currency: "NGN",
      metadata: {
        custom_fields: [
          {
            display_name: "Student Count",
            variable_name: "student_count",
            value: studentCount,
          },
          {
            display_name: "User ID",
            variable_name: "user_id",
            value: user.userId,
          },
          {
            display_name: "Price Per Student",
            variable_name: "price_per_student",
            value: pricePerStudent,
          },
          {
            display_name: "Subtotal",
            variable_name: "subtotal",
            value: subtotal,
          },
          {
            display_name: "Coupon Applied",
            variable_name: "coupon_applied",
            value: couponApplied ? VALID_COUPON : "None",
          },
          {
            display_name: "Discount Amount",
            variable_name: "discount_amount",
            value: discountAmount,
          },
          {
            display_name: "VAT Amount",
            variable_name: "vat_amount",
            value: vatAmount,
          },
        ],
      },
      onClose: function () {
        setIsProcessing(false);
        toast.info("Payment cancelled");
      },
      callback: function (response: any) {
        verifyPayment(response.reference);
      },
    });

    handler.openIframe();
  };

  const verifyPayment = async (reference: string) => {
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
            studentCount: studentCount,
            pricePerStudent: pricePerStudent,
            subtotal: subtotal,
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
          toast.error(
            "Payment successful but failed to register. Please contact support."
          );
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

  const handleLogout = () => {
    nProgress.start();
    logout();
    nProgress.done();
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 p-2 mt-3 lg:mt-5 lg:p-6">
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
        <p className="text-sm">Add Students and proceed to payment</p>
      </div>

      <div className="flex justify-between lg:p-2 flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-4 bg-white rounded-md p-2 py-4 w-full md:w-[48%]">
          <label htmlFor="studentNumber" className="text-sm font-semibold">
            Number of Students
          </label>
          <input
            className="border border-gray-200 rounded-md p-2 text-sm"
            type="number"
            min="1"
            max="1000"
            value={studentCount || ""}
            onChange={(e) => setStudentCount(Number(e.target.value))}
            id="studentNumber"
            placeholder="Enter number of students"
          />
          <div className="text-xs space-y-1">
            <p className="font-semibold">Pricing Tiers:</p>
            <p>50-100 students: ₦5,000/student</p>
            <p>101-300 students: ₦4,500/student</p>
            <p>301-500 students: ₦4,000/student</p>
            <p>501-1000 students: ₦3,500/student</p>
            <p className="text-gray-500 mt-2">*Prices exclude 7.5% VAT</p>
          </div>

          {/* Coupon Code Section */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <label
              htmlFor="couponCode"
              className="text-sm font-semibold block mb-2"
            >
              Have a Coupon Code?
            </label>
            <div className="flex gap-2">
              <input
                className={`border rounded-md p-2 text-sm flex-1 ${
                  couponError ? "border-red-500" : "border-gray-200"
                } ${couponApplied ? "bg-green-50 border-green-500" : ""}`}
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setCouponError("");
                }}
                id="couponCode"
                placeholder="Enter coupon code"
                disabled={couponApplied}
              />
              {!couponApplied ? (
                <button
                  onClick={applyCoupon}
                  className="bg-blue-950 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-900 disabled:opacity-50"
                  disabled={!couponCode.trim()}
                >
                  Apply
                </button>
              ) : (
                <button
                  onClick={removeCoupon}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            {couponError && (
              <p className="text-xs text-red-500 mt-1">{couponError}</p>
            )}
            {couponApplied && (
              <p className="text-xs text-green-600 mt-1 font-semibold">
                ✓ 60% discount applied!
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 bg-white rounded-md p-2 py-4 w-full md:w-[48%]">
          <div className="flex justify-between">
            <p className="text-sm">Students:</p>
            <p className="text-sm">{studentCount}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">Price Per Student:</p>
            <p className="text-sm">₦{formatCurrency(pricePerStudent)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">Subtotal:</p>
            <p className="text-sm">₦{formatCurrency(subtotal)}</p>
          </div>

          {/* Discount Row */}
          {couponApplied && discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <p className="text-sm font-semibold">Discount (60%):</p>
              <p className="text-sm font-semibold">
                -₦{formatCurrency(discountAmount)}
              </p>
            </div>
          )}

          {/* Subtotal after discount */}
          {couponApplied && (
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <p className="text-sm">Subtotal After Discount:</p>
              <p className="text-sm">
                ₦{formatCurrency(subtotalAfterDiscount)}
              </p>
            </div>
          )}

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

          {studentCount > 0 && (
            <p className="text-xs text-gray-600 mt-2">
              ₦{formatCurrency(totalAmount / studentCount)} per student (final
              price incl. VAT & discount)
            </p>
          )}

          {/* Savings indicator */}
          {couponApplied && discountAmount > 0 && (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
              <p className="text-xs text-green-700 font-semibold text-center">
                You're saving ₦
                {formatCurrency(discountAmount + discountAmount * VAT_RATE)}!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 items-center">
        <button
          className="bg-blue-950 text-white p-2 text-xs md:text-sm rounded-md w-full disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={payWithPaystack}
          disabled={!studentCount || studentCount <= 0 || isProcessing}
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

export default SchoolStudentPaymentPage;
