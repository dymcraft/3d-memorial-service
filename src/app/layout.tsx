import type { Metadata } from "next";
import { headers } from "next/headers";
import { Noto_Serif_KR, Noto_Sans_KR, Gaegu } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const displayFont = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const bodyFont = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const accentFont = Gaegu({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-accent",
  display: "swap",
  preload: true,
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
  // 🔥 미들웨어가 실어 보낸 현재 경로를 읽어서, 관리자 페이지에서는
  // 고객용 Header/Footer를 렌더링하지 않는다.
  // (admin/layout.tsx가 자체 사이드바+헤더를 이미 그리고 있어서 이중으로 뜨는 걸 방지)
  const pathname = headers().get("x-pathname") || "";
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="ko">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${accentFont.variable} font-body antialiased bg-stone-paper`}
      >
        {!isAdminRoute && <Header />}
        <main>{children}</main>
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}
