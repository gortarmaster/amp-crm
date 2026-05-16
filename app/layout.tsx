import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A gift for Andres.",
  description: "Your custom CRM — built from scratch, designed around the way you work.",
  openGraph: {
    title: "A gift for Andres.",
    description: "Your custom CRM — built from scratch, designed around the way you work.",
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
