import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A gift for Andres.",
  description: "Something was made for you. Open to find out.",
  openGraph: {
    title: "A gift for Andres.",
    description: "Something was made for you. Open to find out.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg-base text-ink-primary antialiased">{children}</body>
    </html>
  );
}
