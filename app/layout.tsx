import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto, Inter, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bio Vue - Digital Wellness",
  description:
    "BioVue Digital Wellness uses advanced AI to show you what you’ll look like when you reach your goals, before you start. We are a health and wellness app designed to turn goals into commitments by making your vision tangible. Our mission is to help people stay motivated and inspired by showing them images of their future self, so they can clearly see the results they’re working toward from day one.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${inter.variable} ${poppins.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
