import { Metadata } from "next";
import Script from "next/script"; // Import Next.js Script component
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider"; // Ensure correct path


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
      <head>
        {/* Paystack script loaded asynchronously */}
        <Script
          src="https://js.paystack.co/v1/inline.js"
          strategy="afterInteractive"
        />
      </head>
      
      <body>
        <AuthProvider>
          
          {children} {/* Render child components/pages here */}
        </AuthProvider>
      </body>
    </html>
  );
}
