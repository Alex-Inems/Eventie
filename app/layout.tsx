// app/layout.tsx
import { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider"; // Ensure correct path
import Navbar from "@/components/Navbar/Navbar";


export const metadata: Metadata = {
  title: "Uplift",
  description: "UpLifting your business",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar/>
          {children} {/* Render child components/pages here */}
        </AuthProvider>
      
      </body>
    </html>
  );
}
