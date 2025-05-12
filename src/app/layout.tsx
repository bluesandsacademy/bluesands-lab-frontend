import type { Metadata } from "next";
import "./globals.css";
import LoadingBar from "@/components/LoadingBar";
import { UserProvider } from "@/services/UserContext";
import { Suspense } from "react";

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
        <UserProvider> {children} </UserProvider>
      </body>
    </html>
  );
}
