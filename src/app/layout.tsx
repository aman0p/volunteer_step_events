import type { Metadata } from "next";
import { Exo } from "next/font/google";
import "../styles/globals.css";

const exo = Exo({
  variable: "--font-exo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Volunteer Step Events",
  description: "Manage your events and volunteers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${exo.className} antialiased bg-black text-white min-h-screen`}>{children}</body>
    </html>
  );
}
