import type { Metadata, Viewport } from "next";
import { Playpen_Sans_Thai } from "next/font/google";
import "./globals.css";

const playpen = Playpen_Sans_Thai({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-playpen',
})

export const metadata: Metadata = {
  title: "Happy Valentine's day",
  description: "Happy Valentine's day 2026 For Zumoo",
  manifest: "/manifest.json", // 2. เชื่อมไฟล์ manifest
  appleWebApp: { // 3. ตั้งค่าสำหรับ iPhone (iOS)
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Happy Valentine's day",
  },
};

export const viewport: Viewport = {
  themeColor: "#f43f5e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // ห้ามซูม (เพื่อให้เหมือนแอป)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playpen.className} ${playpen.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
