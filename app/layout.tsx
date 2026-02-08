import type { Metadata } from "next";
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
