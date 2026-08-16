import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dynamic QR Business",
  description: "Dynamic QR code management and analytics platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}