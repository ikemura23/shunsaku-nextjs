import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TED式 プレゼン指南所",
  description: "世界最高のプレゼン基準で添削",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-ted-red text-white py-8 mb-8">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">TED式 プレゼン指南所</h1>
            <p className="text-xl opacity-90">〜世界最高のプレゼン基準で添削〜</p>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4">
          {children}
        </main>
      </body>
    </html>
  );
}