import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AskAI",
  description: "Ask anything, get answers powered by Claude AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
