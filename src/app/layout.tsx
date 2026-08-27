import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR, Gaegu } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const displayFont = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});

const bodyFont = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

const accentFont = Gaegu({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-accent",
});

export const metadata: Metadata = {
  title: "3D 기념 흉상/영정 제작",
  description: "사진 한 장으로, 오래 간직할 3D 조형물을 만들어드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${accentFont.variable} font-body antialiased bg-stone-paper`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}