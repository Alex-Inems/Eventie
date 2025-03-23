import { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider"; // Ensure correct path

export const metadata: Metadata = {
  title: "Eventie",
  description: "Your all-in-one platform for effortless event management and discovery",
};

export const viewport = {
  themeColor: "#00FF00", // Green color
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload images */}
        <link rel="preload" as="image" href="/images/slide.jpg" />
        <link rel="preload" as="image" href="/images/slide(2).jpg" />
        <link rel="preload" as="image" href="/images/slide(3).jpg" />
        <link rel="preload" as="image" href="/images/slide4.jpg" />
      </head>
      <body>
        <AuthProvider>
          {children} {/* Render child components/pages here */}
        </AuthProvider>
      </body>
    </html>
  );
}
