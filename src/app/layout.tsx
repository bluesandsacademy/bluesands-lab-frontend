import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from "@/components/LoadingBar";
import { UserProvider } from "@/services/UserContext";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import AuthGuard from "@/services/AuthGuard";

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
          <AuthGuard> {children} </AuthGuard>
        </UserProvider>
      </body>
    </html>
  );
}
