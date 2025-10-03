// "use client";

// import { useUser } from "@/services/UserContext";
// import { useState } from "react";

// const SchoolStudentPayment = () => {
//   const { user } = useUser();
//   const [studentCount, setStudentCount] = useState(0);
//   const pricePerStudent = 5000;

//   const totalAmount = studentCount * pricePerStudent;

//   const payWithPaystack = () => {
//     // Validation
//     if (!studentCount || studentCount <= 0) {
//       alert("Please enter a valid number of students");
//       return;
//     }

//     if (!user?.email) {
//       alert("Please login to continue");
//       return;
//     }

//     // @ts-ignore - PaystackPop is loaded via script tag
//     const handler = window.PaystackPop.setup({
//       key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
//       email: user.email,
//       amount: totalAmount * 100, // convert to kobo
//       currency: "NGN",
//       metadata: {
//         custom_fields: [
//           {
//             display_name: "Student Count",
//             variable_name: "student_count",
//             value: studentCount,
//           },
//           {
//             display_name: "User ID",
//             variable_name: "user_id",
//             value: user.userId,
//           },
//         ],
//       },
//       onClose: function () {
//         alert("Payment cancelled");
//       },
//       callback: function (response: any) {
//         verifyPayment(response.reference);
//       },
//     });

//     handler.openIframe();
//   };

//   const verifyPayment = async (reference: string) => {
//     try {
//       const res = await fetch("/api/verify-payment", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           reference,
//           userId: user?.userId,
//           studentCount: studentCount,
//           amount: totalAmount,
//         }),
//       });

//       const data = await res.json();

//       if (data.verified) {
//         alert("Payment successful! Students added to your account.");
//         setStudentCount(0); // Reset form
//         // Redirect or update UI
//         // window.location.href = '/dashboard';
//       } else {
//         alert("Payment verification failed. Please contact support.");
//       }
//     } catch (error) {
//       console.error("Verification failed:", error);
//       alert("An error occurred. Please contact support.");
//     }
//   };

//   return (
//     <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 p-2 mt-3 lg:mt-5">
//       <div className="flex flex-col gap-2 lg:gap-3">
//         <p className="lg:text-lg font-semibold">Student payment</p>
//         <p className="text-sm">Add Students and proceed to payment</p>
//       </div>

//       <div className="flex justify-between lg:p-2">
//         <div className="flex flex-col gap-4 bg-white rounded-md p-2 py-4 w-[48%]">
//           <label htmlFor="studentNumber" className="text-sm font-semibold">
//             Number of Students
//           </label>
//           <input
//             className="border border-gray-200 rounded-md p-2 text-sm"
//             type="number"
//             min="1"
//             value={studentCount || ""}
//             onChange={(e) => setStudentCount(Number(e.target.value))}
//             id="studentNumber"
//             placeholder="Enter number of students"
//           />
//           <p className="text-xs">*Price per Student: NGN {pricePerStudent}</p>
//         </div>

//         <div className="flex flex-col gap-2 bg-white rounded-md p-2 py-4 w-[48%]">
//           <div className="flex justify-between">
//             <p className="text-sm">Students:</p>
//             <p className="text-sm">{studentCount}</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-sm">Price Per Student:</p>
//             <p className="text-sm">NGN {pricePerStudent}</p>
//           </div>

//           <div className="flex justify-between mt-4 border-t border-t-gray-200 pt-2">
//             <p className="text-sm font-semibold">Total:</p>
//             <p className="text-sm font-semibold">NGN {totalAmount}</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col gap-1 items-center">
//         <button
//           className="bg-blue-950 text-white p-2 text-xs md:text-sm rounded-md w-full disabled:opacity-50 disabled:cursor-not-allowed"
//           onClick={payWithPaystack}
//           disabled={!studentCount || studentCount <= 0}
//         >
//           Proceed to checkout
//         </button>
//         <p className="text-xs text-blue-950">
//           Secure payment processing * All transactions are encrypted
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SchoolStudentPayment;


"use client";

import { useUser } from "@/services/UserContext";
import { useState } from "react";

const SchoolStudentPayment = () => {
  const { user } = useUser();
  const [studentCount, setStudentCount] = useState(0);
  const VAT_RATE = 0.075; // 7.5%

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
  const vatAmount = subtotal * VAT_RATE;
  const totalAmount = subtotal + vatAmount;
  const pricePerStudentWithVAT = pricePerStudent + (pricePerStudent * VAT_RATE);

  const payWithPaystack = () => {
    // Validation
    if (!studentCount || studentCount <= 0) {
      alert("Please enter a valid number of students");
      return;
    }

    if (studentCount > 1000) {
      alert("Maximum 1000 students allowed. Please contact support for larger orders.");
      return;
    }

    if (!user?.email) {
      alert("Please login to continue");
      return;
    }

    // @ts-ignore - PaystackPop is loaded via script tag
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY_TEST,
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
            display_name: "VAT Amount",
            variable_name: "vat_amount",
            value: vatAmount,
          },
        ],
      },
      onClose: function () {
        alert("Payment cancelled");
      },
      callback: function (response: any) {
        verifyPayment(response.reference);
      },
    });

    handler.openIframe();
  };

  const verifyPayment = async (reference: string) => {
    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          userId: user?.userId,
          studentCount: studentCount,
          pricePerStudent: pricePerStudent,
          subtotal: subtotal,
          vatAmount: vatAmount,
          amount: totalAmount,
        }),
      });

      const data = await res.json();

      if (data.verified) {
        alert("Payment successful! Students added to your account.");
        setStudentCount(0); // Reset form
        // Redirect or update UI
        // window.location.href = '/dashboard';
      } else {
        alert("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      alert("An error occurred. Please contact support.");
    }
  };

  // Format number to currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 p-2 mt-3 lg:mt-5">
      <div className="flex flex-col gap-2 lg:gap-3">
        <p className="lg:text-lg font-semibold">Student payment</p>
        <p className="text-sm">Add Students and proceed to payment</p>
      </div>

      <div className="flex justify-between lg:p-2">
        <div className="flex flex-col gap-4 bg-white rounded-md p-2 py-4 w-[48%]">
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
        </div>

        <div className="flex flex-col gap-2 bg-white rounded-md p-2 py-4 w-[48%]">
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
          <div className="flex justify-between">
            <p className="text-sm">VAT (7.5%):</p>
            <p className="text-sm">₦{formatCurrency(vatAmount)}</p>
          </div>

          <div className="flex justify-between mt-4 border-t border-t-gray-200 pt-2">
            <p className="text-sm font-semibold">Total:</p>
            <p className="text-sm font-semibold">₦{formatCurrency(totalAmount)}</p>
          </div>
          
          {studentCount > 0 && (
            <p className="text-xs text-gray-600 mt-2">
              ₦{formatCurrency(pricePerStudentWithVAT)} per student (incl. VAT)
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 items-center">
        <button
          className="bg-blue-950 text-white p-2 text-xs md:text-sm rounded-md w-full disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={payWithPaystack}
          disabled={!studentCount || studentCount <= 0}
        >
          Proceed to checkout
        </button>
        <p className="text-xs text-blue-950">
          Secure payment processing * All transactions are encrypted
        </p>
      </div>
    </div>
  );
};

export default SchoolStudentPayment;