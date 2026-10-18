import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "轩 · 梦",
  description: "她在时间的褶皱里行走。轩的主页：相识、相知、相惜与须知。",
  applicationName: "轩 · 梦",
  appleWebApp: {
    capable: true,
    title: "轩 · 梦",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/images/portrait.jpg",
    apple: "/images/portrait.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
