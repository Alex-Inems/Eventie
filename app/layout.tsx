import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import DynamicThemeColor from "@/components/DynamicThemeColor";
import ToastProvider from "@/components/ToastProvider";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "at your tips...",
  description:
    "Your all-in-one platform for effortless event management and discovery",
  themeColor: "#004b23", // Fallback theme color (overridden dynamically)
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "at your tips...",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#004b23", // fallback value
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>
          <DynamicThemeColor />
          <ToastProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
