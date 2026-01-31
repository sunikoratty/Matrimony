import type { Metadata } from "next";

import "./globals.css";

const geistSans = {
  variable: "--font-geist-sans",
  className: "font-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
  className: "font-mono",
};

export const metadata: Metadata = {
  title: "Match",
  description: "Your premium matrimony platform for finding soulmates.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>❤️</text></svg>",
  },
};

import { ToastProvider } from "@/components/ui/Toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
