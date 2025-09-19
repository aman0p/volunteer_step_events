import type { Metadata } from "next";
import { Exo, Roboto } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/Providers";

const exo = Exo({
   variable: "--font-exo",
   subsets: ["latin"],
});

const roboto = Roboto({
   variable: "--font-roboto",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Volunteer Step Events",
   description: "Manage your events and volunteers",
   icons: {
      icon: "/default/logo.svg",
   },
};

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={`${exo.className} ${roboto.className} antialiased`}>
            <Providers>{children}</Providers>
         </body>
      </html>
   );
}
