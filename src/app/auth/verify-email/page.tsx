// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import { useUser } from "@/services/UserContext";

// export default function VerifyPage({ params }: { params: { id: string } }) {
//   const router = useRouter();
//   const [verificationMessage, setVerificationMessage] = useState(
//     "Verifying your email..."
//   );
//   const { user, setUser } = useUser();

//   useEffect(() => {
//     const verifyEmail = async () => {
//       try {
//         const response = await axios.get(`/auth/verify-email/${params.id}`);
//         if (response.status === 200) {
//           if (user) {
//             setUser({ ...user, isVerified: true });
//           }

//           setVerificationMessage(
//             "Your email has been successfully verified!  Redirecting to Login..."
//           );
//           toast.success("Your email has been successfully verified!");

//           setTimeout(() => {
//             router.push("/auth/login");
//           }, 3000);
//         } else {
//           setVerificationMessage("Invalid or expired verification link.");
//         }
//       } catch (error: any) {
//         console.error(error);
//         if (error.response?.status === 400) {
//           setVerificationMessage("Invalid verification link.");
//         } else if (error.response?.status === 410) {
//           setVerificationMessage("Verification link has expired.");
//           return (
//             <div className="flex items-center justify-center h-screen bg-gray-100">
//               <div className="bg-white p-6 rounded-lg shadow-lg text-center">
//                 <p className="text-gray-600 text-xl mb-6">
//                   {verificationMessage}
//                 </p>
//                 <button className="text-white bg-bgBlue p-4">
//                   Request for new verification email
//                 </button>
//               </div>
//             </div>
//           );
//         } else {
//           setVerificationMessage(
//             "Something went wrong. Please try again later."
//           );
//           return (
//             <div className="flex items-center justify-center h-screen bg-gray-100">
//               <div className="bg-white p-6 rounded-lg shadow-lg text-center">
//                 <p className="text-gray-600 text-xl mb-6">
//                   {verificationMessage}
//                 </p>
//                 <button className="text-white bg-bgBlue p-4">
//                   Request for new verification email
//                 </button>
//               </div>
//             </div>
//           );
//         }
//       }
//     };

//     verifyEmail();
//   }, [params.id, user, setUser, router]);

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-lg text-center">
//         {user?.isVerified === false || user?.isVerified === undefined ? (
//           <>
//             <img
//               src="/logo/blue_sands_blue.png"
//               alt="Logo"
//               className="w-auto h-[80px] mx-auto"
//             />
//             <p className="text-gray-600 text-xl">{verificationMessage}</p>
//           </>
//         ) : (
//           <>
//             <img
//               src="/logo/blue_sands_blue.png"
//               alt="Logo"
//               className="w-auto h-[80px] mx-auto"
//             />
//             <p
//               className={`text-xl ${
//                 user?.isVerified ? "text-green-600" : "text-red-600"
//               }`}
//             >
//               {verificationMessage}
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
