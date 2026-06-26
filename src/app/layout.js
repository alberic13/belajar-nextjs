import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SplashCursor from "@/components/SplashCursor";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Kursus Kecantikan Solo Baru | LKP Exotic Solo Baru",
  description: "Lembaga Kursus Kecantikan & Salon Profesional LKP Exotic Solo Baru. Dapatkan sertifikat resmi untuk program Hair Extensions, Hairstyling, Hair Colouring, dan Manajemen Salon.",
  keywords: "kursus kecantikan solo, lkp exotic solo baru, sekolah kecantikan, hair extensions, hairstyling, hair colouring, salon kecantikan, belajar salon, sukoharjo",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${jakarta.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-stone-900 font-sans">
        <SplashCursor />
        {children}
      </body>
    </html>
  );
}

