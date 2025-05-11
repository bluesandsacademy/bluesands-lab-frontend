import type { Metadata } from "next";
import "./globals.css";
import LoadingBar from "@/components/LoadingBar";
import { UserProvider } from "@/services/UserContext";

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
        <LoadingBar />
        <UserProvider> {children} </UserProvider>
      </body>
    </html>
  );
}
