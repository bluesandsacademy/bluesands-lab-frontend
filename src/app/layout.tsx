import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from "@/components/LoadingBar";
import { UserProvider } from "@/services/UserContext";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import AuthGuard from "@/services/AuthGuard";
import Providers from "./Providers";
import { GoogleOAuthProvider } from "@react-oauth/google";


export const metadata: Metadata = {
  title: "Blue Sands Stem Labs",
  description:
    "Transforming Education Through Innovation with Cutting-Edge STEM Learning Experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://js.paystack.co/v1/inline.js"></script>
      </head>
      <body className={` antialiased`}>
        <Suspense fallback={null}>
          <LoadingBar />
        </Suspense>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <UserProvider>
          <GoogleOAuthProvider clientId="">
          <Providers>
            <AuthGuard> {children} </AuthGuard>
          </Providers>
          </GoogleOAuthProvider>
        </UserProvider>
      </body>
    </html>
  );
}
