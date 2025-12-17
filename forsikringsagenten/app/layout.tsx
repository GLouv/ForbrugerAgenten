import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ComingSoonBanner } from "@/components/ComingSoonBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ForbrugerAgenten | Din automatiske forbrugs-vagthund",
  description: "Vi overvåger dine abonnementer, finder besparelser og forhandler priser for dig. Helt automatisk. Sikker login med MitID.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ComingSoonBanner />
        {children}
      </body>
    </html>
  );
}
