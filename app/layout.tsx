import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#7657a2",
};

export const metadata: Metadata = {
  title: "CareLocate",
  description: "Find the right urgent care — fast. Takes under a minute. We match you to the most suitable clinic, not just the nearest one.",
  openGraph: {
    title: "CareLocate",
    description: "Find the right urgent care — fast.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareLocate",
    description: "Find the right urgent care — fast.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
